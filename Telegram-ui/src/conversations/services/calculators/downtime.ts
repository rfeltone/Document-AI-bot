function parseRuDate(date: string): Date {
  const [day, month, year] = date.split(".").map(Number);

  // month - 1, потому что в JS месяцы с нуля:
  // 0 = январь, 1 = февраль и т.д.
  return new Date(year, month - 1, day);
}

function totalDays(arrivedAt: Date, releasedAt: Date): number {
  // Берем только календарную дату, без влияния времени
  const start = new Date(
    arrivedAt.getFullYear(),
    arrivedAt.getMonth(),
    arrivedAt.getDate()
  );

  const end = new Date(
    releasedAt.getFullYear(),
    releasedAt.getMonth(),
    releasedAt.getDate()
  );

  const diffMs = end.getTime() - start.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  // +1 потому что считаем дни включительно:
  // 01.02 -> 01.02 = 1 день
  // 01.02 -> 04.02 = 4 дня


  return diffDays + 1;
}


function splitDays(totalDays:number) {
const normDays = Math.min(totalDays, 2)
const overdays = Math.max(totalDays - 2, 0)
return {normDays, overdays}
}



export function mainCalculate(date1: string, date2: string, type: string): string {
  const arrivedAt = parseRuDate(date1);
  const releasedAt = parseRuDate(date2);
  if (releasedAt < arrivedAt) {
  return "Дата окончания простоя не может быть раньше даты прибытия";
}
  const days = totalDays(arrivedAt, releasedAt);
  const overAndNormDays = splitDays(days);

  switch (type) {
    case "SUG":
      return calculateSugPenalty(overAndNormDays.overdays);

    case "OIL":
      return calculateOilPenalty(overAndNormDays.overdays);

    case "PLAT":
      return calculatePlatformPenalty(overAndNormDays.overdays);

    default:
      return "Неизвестный тип расчета";
  }
}




function calculateSugPenalty(overDays: number): string {
    const days4000 = Math.max(overDays - 4, 0);
    const days3000 = overDays - days4000;
    const summ = days3000 * 3000 + days4000 * 4000
  return `Итоговая сумма ${summ},\n это ${overDays} дней/дня простоя, в котором ${days3000} дня считаются по 3000Р и ${days4000} дня по 4000Р `
}
function calculateOilPenalty(overDays: number): string {
    const days4000 = Math.max(overDays - 4, 0);
    const days2000 = overDays - days4000;
    const summ = days2000 * 2000 + days4000 * 4000
    return `Итоговая сумма ${summ}\n, это ${overDays} дней/дня простоя, в котором ${days2000} дня считаются по 2000Р и ${days4000} дня по 4000Р `;
}

function calculatePlatformPenalty(overDays: number): string {
    const summ = overDays * 8878
    return `Итоговая сумма ${summ}\n, это ${overDays} дней/дня простоя`;
}
