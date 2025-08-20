import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useFormSubmissions } from '~/hooks/Form';
import { useState, useEffect } from 'react';
import type { UserSubmission } from '~/types';

export type FormUserStatisticsProps = {
  formId: string;
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B6B'];

const FormUserStatistics = ({ formId }: FormUserStatisticsProps) => {
  const [allSubmissions, setAllSubmissions] = useState<UserSubmission[]>([]);
  const [isLoadingAll, setIsLoadingAll] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { data: submissionsData, isLoading } = useFormSubmissions(formId, currentPage);

  useEffect(() => {
    if (submissionsData) {
      setAllSubmissions((prev) => [...prev, ...submissionsData.results]);

      if (submissionsData.next) {
        setCurrentPage((prev) => prev + 1);
      } else {
        setIsLoadingAll(false);
      }
    }
  }, [submissionsData]);

  useEffect(() => {
    setAllSubmissions([]);
    setCurrentPage(1);
    setIsLoadingAll(true);
  }, []);

  if (isLoading && allSubmissions.length === 0) {
    return <div className='text-center'>Laster brukerstatistikk...</div>;
  }

  if (isLoadingAll) {
    return <div className='text-center'>Laster alle svar... ({allSubmissions.length} svar lastet)</div>;
  }

  if (!allSubmissions.length) {
    return <div className='text-center'>Ingen svar funnet for dette skjemaet</div>;
  }

  const submissions = allSubmissions;

  if (submissions.length > 0) {
    console.log('Sample form submission:', submissions[0]);
    console.log('Available fields:', Object.keys(submissions[0]));
  }

  const studyProgramData = submissions.reduce((acc, submission) => {
    const studyProgram = submission.user.study?.group?.name || 'Ukjent';
    acc[studyProgram] = (acc[studyProgram] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const studyYearData = submissions.reduce((acc, submission) => {
    const studyYear = submission.user.studyyear?.group?.name || 'Ukjent';
    acc[studyYear] = (acc[studyYear] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const genderData = submissions.reduce((acc, submission) => {
    const gender = submission.user.gender === 1 ? 'Mann' : submission.user.gender === 2 ? 'Kvinne' : 'Annet';
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const answerTypesData = submissions.reduce((acc, submission) => {
    submission.answers.forEach((answer) => {
      if (answer.answer_text && answer.answer_text.trim()) {
        acc['Tekst'] = (acc['Tekst'] || 0) + 1;
      }
      if (answer.selected_options && answer.selected_options.length > 0) {
        acc['Valgte alternativer'] = (acc['Valgte alternativer'] || 0) + 1;
      }
      if ((!answer.answer_text || !answer.answer_text.trim()) && (!answer.selected_options || answer.selected_options.length === 0)) {
        acc['Tomme svar'] = (acc['Tomme svar'] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  const studyProgramChartData = Object.entries(studyProgramData).map(([name, value]) => ({
    name,
    value,
  }));

  const studyYearChartData = Object.entries(studyYearData).map(([name, value]) => ({
    name,
    value,
  }));

  const genderChartData = Object.entries(genderData).map(([name, value]) => ({
    name,
    value,
  }));

  const answerTypesChartData = Object.entries(answerTypesData).map(([name, value]) => ({
    name,
    value,
  }));

  const totalSubmissions = submissions.length;
  const uniqueUsers = new Set(submissions.map((s) => s.user.user_id)).size;

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle>Totalt antall svar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{totalSubmissions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unike brukere</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{uniqueUsers}</div>
          </CardContent>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Studieprogram</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={studyProgramChartData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'>
                  {studyProgramChartData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Studieår</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={studyYearChartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='value' fill='#8884d8' />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kjønn</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={genderChartData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'>
                  {genderChartData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Type svar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={answerTypesChartData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'>
                  {answerTypesChartData.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormUserStatistics;
