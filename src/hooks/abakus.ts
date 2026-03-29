import { Group, GroupList } from '~/types/Group';

export const ABAKUS_GROUP_MAP: Record<string, { name: string; image?: string }> = {
  hs: { name: 'Hovedstyret', image: 'https://thumbor.abakus.no/K9CE8rGZm4y7DcUvBmCT3v4Hnic=/400x400/hs_ny.png' },
  index: { name: 'Webkom', image: 'https://thumbor.abakus.no/S5vUWojN8GzrgKa0iSNFDzzRUik=/400x400/abakus_webkom.png' },
  forvaltningsgruppen: { name: 'Fondsstyret', image: 'https://thumbor.abakus.no/G3l1ZZyCShJBf_b7vxw4GXaaH3g=/400x400/bedrekvalitetfondstyret01.png' },
  nok: { name: 'Bedkom', image: 'https://thumbor.abakus.no/DQx9BWZcOZey2UuEuOCywN-c8rc=/400x400/abakus_bedkom.png' },
  kontkom: { name: 'Koskom', image: 'https://thumbor.abakus.no/91iAHHGAyiZqI_pakITDdSH_0tU=/400x400/groups-2015-08-19-2018-Koskom.png' },
  promo: { name: 'PR', image: 'https://thumbor.abakus.no/MebbuzSeZCs04kIJQU1Z2_RrUJA=/400x400/PR_logo.png' },
  sosialen: { name: 'Arrkom', image: 'https://thumbor.abakus.no/90ultWI0reP9-cUC8cPmPYIX6q4=/400x400/arrkom_ny.png' },
  okom: { name: 'Bankkom', image: 'https://thumbor.abakus.no/w-ancC-T7AHH8nKIWtnDfMp1wkA=/400x400/bankkom01_C0BtIzd.png' },
  redaksjonen: { name: 'readme', image: 'https://thumbor.abakus.no/aFxk4lF8BT-SdrffOcvIZeh7vBU=/400x400/readme_riktigfarge.png' },
  semikolon: { name: 'Algorytmen' },
  handball: { name: 'Abax Håndballklubb' },
  'pythons-gutter-a': { name: 'Datakameratene Gutter' },
  'pythons-jenter': { name: 'Datakameratene Jenter' },
};

export function ConvertGroup<T extends Group | GroupList>(group: T): T & { originalName: string } {
  const AbakusInfo = ABAKUS_GROUP_MAP[group.slug];
  if (!AbakusInfo)
    return {
      ...group,
      name: group.name.replace(/tihlde/i, 'Abakus'),
      originalName: group.name,
    };
  return {
    ...group,
    name: AbakusInfo.name,
    originalName: group.name,
    image: AbakusInfo.image ?? group.image,
  };
}
