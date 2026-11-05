export type Note = {
  id: string;
  title: string;
  body: string;
};

export const notes: Note[] = [
  {
    id: 'q3-support-review',
    title: 'Q3 support review',
    body: `The support team handled 4,120 tickets in the third quarter, an increase of 18 percent on the second quarter. Most of the growth came from the new mobile app, which accounted for about a third of all tickets. Average first response time rose from 3 hours to just over 5 hours, because two team members were on parental leave for most of August. Customer satisfaction stayed steady at 91 percent. The most common complaint was that password reset emails arrive late or end up in spam folders. Engineering has moved the emails to a new provider, and complaints have already fallen in the first weeks of October. For the fourth quarter, the team will add one new hire, publish a help article for the five most common mobile questions, and review its first response target in December.`
  },
  {
    id: 'office-move',
    title: 'Moving to the new office',
    body: `Our Hamburg team moves to the new office on Hafenstrasse on the last weekend of February. Please pack your desk by the Thursday before, using the crates that facilities will deliver that Monday. Label each crate with your name and new desk number, which you will find on the seating plan in the shared drive. IT will move all monitors and docking stations, so leave those on your desk and do not unplug them. Laptops stay with you. The new office has 40 desks for 65 people, so we are switching to desk booking, and the booking tool goes live two weeks before the move. There are bicycle racks and showers in the basement, and the nearest underground station is a six-minute walk. If you need an adjusted desk or have access requirements, contact facilities by the end of January.`
  },
  {
    id: 'pricing-experiment',
    title: 'Pricing experiment results',
    body: `From May to July we tested a new annual plan with 2,000 new sign-ups, split evenly between the old pricing page and a new one that shows the annual plan first. On the new page, 31 percent chose an annual plan, compared with 19 percent on the old page. Total sign-ups fell slightly, by about 4 percent, and the difference was not statistically significant. Revenue per sign-up in the first year rose by 22 percent. We also saw more refund requests in the first 30 days, 3.1 percent against 2.2 percent, mostly from small teams who said they had expected a monthly option. Our recommendation is to roll out the new page, keep the monthly plan clearly visible, and add a short comparison table. We will check refund rates again after 90 days before making any further changes.`
  }
];

export function findNote(id: string) {
  return notes.find((note) => note.id === id);
}
