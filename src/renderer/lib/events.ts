const randomEvents: string[] = [
  "Wizzrobe lands a grab",
  "Zain misses a pivot",
  "n0ne does something sick",
  "the wind blows",
  "you feeling kinda cute",
  "you feel so tired but you can't sleep",
  "nobody laughs at your joke",
  "you try your best but you don't succeed",
  "Jesus returns",
  "Natalie Tran makes a lamington video",
  "Hungrybox lands a rest",
  "you get what you want but not what you need",
  "someone says that Melee is a dead game",
  "aMSa wins a major",
  "you get left on read",
  "Shippiddge releases Starter Squad 10",
];

export const generateRandomEvent = () => {
  const d = new Date();
  // Start at current day + month
  const offset = d.getDate() + d.getMonth();
  // If the current hour is odd, add one, else minus one
  const switcher = d.getHours() % 2 ? 1 : -1;
  const index = (offset + switcher) % randomEvents.length;
  return randomEvents[index] + "...";
};
