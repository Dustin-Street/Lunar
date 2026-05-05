const randomLoadingStrings = [
  "Gathering your thoughts from the ether…",
  "Dusting off your journals…",
  "Lighting a small lantern for your memories…",
  "Opening the pages where you left off…",
  "Collecting your entries… gently.",
  "Your journals are waking up…",
  "Retrieving the stories you’ve written…",
  "Preparing your space to reflect…",
  "Fetching the pages that matter today…",
  "Your words are finding their way back…",
  "Unfolding your past moments…",
  "Letting your journals settle in…",
  "Bringing your reflections into view…",
  "Your thoughts are almost here…",
  "Softly gathering your entries…",
  "Aligning your memories…",
  "Your journals are opening their eyes…",
  "Calling your pages home…",
  "Your reflections are on their way…",
  "Centering your journaling space…",
];

export default function getRandomLoadingString(){
  return randomLoadingStrings[Math.floor(Math.random() * randomLoadingStrings.length)];
}
