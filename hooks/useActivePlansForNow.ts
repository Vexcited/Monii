import { Plans } from "@/atoms/plans";
import { useAtomValue } from "jotai"

export const useActivePlansForNow = (date = new Date()) => {
  const plans = useAtomValue(Plans);

  const currentDay = date.getDate();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();

  return plans.filter(plan => {
    const parts = plan.date.split("-");
    const [day, month, year] = parts;

    // start with monthly repeat (parts.length === 1)
    let show = currentDay < parseInt(day);

    if (parts.length >= 2) { // yearly repeat
      show = show && currentMonth === parseInt(month);
    }

    if (parts.length === 3) { // no repeat
      show = show && currentYear === parseInt(year);
    }

    return show;
  });
}
