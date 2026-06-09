import { db } from './index';
import { issues } from './schema';

const MOCK_ISSUES = [
  {
    title: 'Severe flooding on Jl. Sudirman near intersection',
    description: "There is a severe flooding in the right lane going northbound on Main Street/Jl. Sudirman, just past the intersection with 4th Avenue. It's approximately 2 feet deep. Several cars have hit it and I've seen at least one driver pull over to check their tires.",
    category: 'flooding' as const,
    status: 'open' as const,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    lat: '-6.2088',
    lng: '106.8456',
    address: 'Jl. Jend. Sudirman No.21, RT.10/RW.11, Kuningan, Jakarta Selatan',
    upvote_count: 24,
    photo_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxyYr5SdM2Wy9dSFIpmt8ZrMKD67VFLsOF1UOhSlxfiBWD8gbklX9goILB2IFg6mIuoA2z9jmSH7avUwoX_POY3z6EECf_GonTV7uTBP9oBvkVOUoT-4D81AMkQTr56mJoP86T7nQBOK_ykoPpTkspD7vi6oa-4QKslNWQak4PTB6rCgs75sHmdOBggvYiNv6n-csO8RNcKyc4LdrpjkU2VR_Ue7tY0FMzp0DpjKyfgOdDWVwKpvRmgBWseTrj1FvBKsEeKJYTNXG3',
  },
  {
    title: 'Overflowing dumpster spreading debris onto sidewalk',
    description: 'A photograph showing a heavily overflowing green public garbage bin on a busy urban sidewalk. Trash bags and loose debris are piled high and spilling onto the concrete pavement.',
    category: 'waste' as const,
    status: 'open' as const,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    lat: '-6.2120',
    lng: '106.8500',
    address: 'Jl. HR Rasuna Said, Kuningan Timur, Jakarta Selatan',
    upvote_count: 42,
    photo_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVv7kB1u2q5MtmLcIQSdTcy32ZwYDrDlVQuK5FQ9cuZ87mCM6ZIAOUJZNEDIH7KbnFpbjHhFpmtHIHCVvEin8KZilEY-nIbwVd9nn8HB7bjRVdGc1OzxuqIPlnDQ7Oa_NkGGrd1SgQUo1hoFYgORFnKcVEOXPhsbKYvt2ADhUQj5qt0_TlPtZqg8g5SajSA-5C25GODw8tbln9-6MJZv0Dsi1rT0_QvY8IowIHWQW5T_bOJTihgFtAIuZ8nL8JgwdAiVHf2qsZU5y8',
  },
  {
    title: 'Severe pothole causing traffic hazard',
    description: 'A significant, deep pothole in a cracked asphalt road surface. The edges of the pothole are jagged, and the interior shows loose gravel and dirt.',
    category: 'road_damage' as const,
    status: 'in_progress' as const,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    lat: '-6.2050',
    lng: '106.8380',
    address: 'Jl. Gatot Subroto, Menteng Dalam, Tebet, Jakarta Selatan',
    upvote_count: 128,
    photo_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNospir87ZDV1l6SNWURU7Vl5bzVQWfWBn2EDH5wBIb5y1BHSfQ5y2d7fo5q_23adHpmhFj1ulczym3AHFLg3tELATORQxvu6BQyZ7HmfRtv6SKCBrFwKTHH6jUXEr3FIQbRgd2GNDL3GVAqSaAvtaTm1xxTZB4qbCfE8GYq5TphgHAxEY4pOIF2X3hCT7GAUAXX0rlUnKEfj_lhmUnhdj53AF71mJHHdbTwuxGeD-K4g3n1IuB2FbgmkFDs_EWzdlUy0wMqBNpMEA',
  },
  {
    title: 'Streetlight out for three consecutive nights',
    description: 'The street lamp is completely dead. This street section is very dark and dangerous for pedestrians at night.',
    category: 'lighting' as const,
    status: 'open' as const,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
    lat: '-6.2180',
    lng: '106.8410',
    address: 'Jl. Satrio, Karet Semanggi, Setiabudi, Jakarta Selatan',
    upvote_count: 15,
  }
];

async function seed() {
  console.log('Seeding mock database...');
  try {
    for (const issue of MOCK_ISSUES) {
      await db.insert(issues).values(issue);
    }
    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    process.exit(0);
  }
}

seed();
