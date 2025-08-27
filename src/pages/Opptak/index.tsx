import API from '~/api/api';
import { authClientWithRedirect } from '~/api/auth';
import Page from '~/components/navigation/Page';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '~/components/ui/table';
import { useGroupsByType } from '~/hooks/Group';
import type { GroupForm, UserSubmission } from '~/types';
import { Calendar, Download, FileText, Users } from 'lucide-react';
import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { toast } from 'sonner';

export async function clientLoader({ request }: { request: Request }) {
  await authClientWithRedirect(request);
}

interface ApplicantSubmission {
  user: UserSubmission['user'];
  submissions: Array<{
    group: string;
    groupName: string;
    formTitle: string;
    submittedAt: string;
  }>;
  totalSubmissions: number;
}

const Opptak = () => {
  const { SUB_GROUPS, isLoading: groupsLoading } = useGroupsByType({ overview: true });

  const groupSlugs = useMemo(() => SUB_GROUPS.map((g) => g.slug), [SUB_GROUPS]);

  const allGroupForms = useQuery(
    ['all-group-forms', groupSlugs],
    async () => {
      const formsPromises = SUB_GROUPS.map(async (group) => {
        try {
          const forms = await API.getGroupForms(group.slug);
          return { group, forms };
        } catch (error) {
          return { group, forms: [] };
        }
      });

      const results = await Promise.all(formsPromises);
      return results;
    },
    {
      enabled: SUB_GROUPS.length > 0,
    },
  );

  const opptakForms = useMemo(() => {
    const forms: Array<{ group: string; groupName: string; form: GroupForm }> = [];

    if (allGroupForms.data) {
      allGroupForms.data.forEach(({ group, forms: groupForms }) => {
        if (groupForms) {
          const opptakForm = groupForms.find((form: GroupForm) => {
            const titleLower = form.title.toLowerCase();
            return titleLower.includes('opptak') || titleLower.includes('søknad') || titleLower.includes('application');
          });

          if (opptakForm) {
            forms.push({
              group: group.slug,
              groupName: group.name,
              form: opptakForm,
            });
          }
        }
      });
    }

    return forms;
  }, [allGroupForms.data]);

  const formIds = useMemo(() => opptakForms.map((f) => f.form.id), [opptakForms]);

  const allFormSubmissions = useQuery(
    ['all-form-submissions', formIds],
    async () => {
      const submissionsPromises = opptakForms.map(async ({ form }) => {
        try {
          const allSubmissions: Array<UserSubmission> = [];
          let page = 1;
          let hasMore = true;

          while (hasMore) {
            const response = await API.getSubmissions(form.id, { page });
            if (response.results) {
              allSubmissions.push(...response.results);
            }

            hasMore = response.next !== null;
            page++;
          }

          return { formId: form.id, submissions: { results: allSubmissions } };
        } catch (error) {
          return { formId: form.id, submissions: null };
        }
      });

      const results = await Promise.all(submissionsPromises);
      return results;
    },
    {
      enabled: opptakForms.length > 0,
    },
  );

  const allSubmissions = useMemo(() => {
    const submissions: Array<UserSubmission & { formId: string }> = [];

    if (allFormSubmissions.data) {
      allFormSubmissions.data.forEach(({ formId, submissions: formSubmissions }) => {
        if (formSubmissions?.results) {
          submissions.push(
            ...formSubmissions.results.map((submission) => ({
              ...submission,
              formId,
            })),
          );
        }
      });
    }

    return submissions;
  }, [allFormSubmissions.data]);

  const applicantStats = useMemo(() => {
    const applicantMap = new Map<string, ApplicantSubmission>();

    allSubmissions.forEach((submission) => {
      const userId = submission.user.user_id;
      const existing = applicantMap.get(userId);

      const formInfo = opptakForms.find(({ form }) => form.id === submission.formId);

      if (formInfo) {
        const submissionInfo = {
          group: formInfo.group,
          groupName: formInfo.groupName,
          formTitle: formInfo.form.title,
          submittedAt: submission.created_at,
        };

        if (existing) {
          existing.submissions.push(submissionInfo);
          existing.totalSubmissions = existing.submissions.length;
        } else {
          applicantMap.set(userId, {
            user: submission.user,
            submissions: [submissionInfo],
            totalSubmissions: 1,
          });
        }
      }
    });

    const allApplicants = Array.from(applicantMap.values()).sort((a, b) => b.totalSubmissions - a.totalSubmissions);
    const multipleApplicants = allApplicants.filter((applicant) => applicant.totalSubmissions > 1);
    const singleApplicants = allApplicants.filter((applicant) => applicant.totalSubmissions === 1);

    return [...multipleApplicants, ...singleApplicants];
  }, [allSubmissions, opptakForms]);

  const totalApplicants = applicantStats.length;
  const totalSubmissions = applicantStats.reduce((sum, applicant) => sum + applicant.totalSubmissions, 0);
  const averageSubmissions = totalApplicants > 0 ? (totalSubmissions / totalApplicants).toFixed(1) : 0;

  const downloadCSV = async () => {
    try {
      const csvContent = [
        ['Navn', 'E-post', 'Studie', 'Studiekull', 'Antall søknader', 'Grupper søkt til', 'Søknadsdatoer'].join(','),
        ...applicantStats.map((applicant) =>
          [
            `${applicant.user.first_name} ${applicant.user.last_name}`,
            applicant.user.email,
            applicant.user.study.group.name,
            applicant.user.studyyear.group.name,
            applicant.totalSubmissions,
            applicant.submissions.map((s) => s.groupName).join('; '),
            applicant.submissions.map((s) => new Date(s.submittedAt).toLocaleDateString('nb-NO')).join('; '),
          ].join(','),
        ),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `opptak-statistikk-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast.error('Noe gikk galt ved nedlasting av CSV');
    }
  };

  const isLoading = groupsLoading || allGroupForms.isLoading || allFormSubmissions.isLoading;

  if (isLoading) {
    return (
      <Page className='max-w-7xl mx-auto pt-24 px-4'>
        <div className='flex justify-center items-center h-64'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4'></div>
            <p>Laster opptakstatistikk...</p>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page className='max-w-7xl mx-auto pt-24 px-4'>
      <div className='space-y-8'>
        <div className='text-center'>
          <h1 className='text-3xl font-bold mb-2'>Opptakstatistikk</h1>
          <p className='text-muted-foreground'>Oversikt over søknader til undergrupper</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Totalt søkere</CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{totalApplicants}</div>
              <p className='text-xs text-muted-foreground'>Unike søkere</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Totalt søknader</CardTitle>
              <FileText className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{totalSubmissions}</div>
              <p className='text-xs text-muted-foreground'>Alle innsendinger</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Gjennomsnitt</CardTitle>
              <Calendar className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{averageSubmissions}</div>
              <p className='text-xs text-muted-foreground'>Søknader per søker</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>Flere søknader</CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{applicantStats.filter((a) => a.totalSubmissions > 1).length}</div>
              <p className='text-xs text-muted-foreground'>Søkere med flere søknader</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className='flex justify-between items-center'>
              <div>
                <CardTitle>Søkere og deres søknader</CardTitle>
                <CardDescription>Liste over alle som har søkt til undergrupper, gruppert etter antall søknader</CardDescription>
              </div>
              <Button onClick={downloadCSV} size='sm' variant='outline'>
                <Download className='h-4 w-4 mr-2' />
                Last ned CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table className='w-full'>
              <TableRow className='w-full'>
                <TableCell className='w-[20%]'>Navn</TableCell>
                <TableCell className='w-[20%]'>E-post</TableCell>
                <TableCell className='w-[15%]'>Studie</TableCell>
                <TableCell className='w-[15%]'>Studiekull</TableCell>
                <TableCell className='w-[10%]'>Antall søknader</TableCell>
                <TableCell className='w-[20%]'>Grupper søkt til</TableCell>
              </TableRow>
              <TableBody>
                {applicantStats.map((applicant) => (
                  <TableRow className={applicant.totalSubmissions > 1 ? 'bg-muted/50' : ''} key={applicant.user.user_id}>
                    <TableCell className='font-medium'>
                      {applicant.user.first_name} {applicant.user.last_name}
                      {applicant.totalSubmissions > 1 && (
                        <Badge className='ml-2 text-xs' variant='destructive'>
                          {applicant.totalSubmissions} søknader
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{applicant.user.email || 'N/A'}</TableCell>
                    <TableCell>{applicant.user.study?.group?.name || 'N/A'}</TableCell>
                    <TableCell>{applicant.user.studyyear?.group?.name || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant={applicant.totalSubmissions > 1 ? 'default' : 'secondary'}>{applicant.totalSubmissions}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className='space-y-1'>
                        {applicant.submissions.map((submission) => (
                          <div className='text-sm' key={`${applicant.user.user_id}-${submission.group}`}>
                            {submission.groupName}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
};

export default Opptak;
