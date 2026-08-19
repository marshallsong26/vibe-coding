declare module "lunar-javascript" {
  type EightChar = {
    setSect(sect: 1 | 2): void;
    getYear(): string;
    getMonth(): string;
    getDay(): string;
    getTime(): string;
    getYearGan(): string;
    getYearZhi(): string;
    getMonthGan(): string;
    getMonthZhi(): string;
    getDayGan(): string;
    getDayZhi(): string;
    getTimeGan(): string;
    getTimeZhi(): string;
    getYearWuXing(): string;
    getMonthWuXing(): string;
    getDayWuXing(): string;
    getTimeWuXing(): string;
  };

  type LunarDate = { getEightChar(): EightChar };
  type SolarDate = { getLunar(): LunarDate };

  const lunar: {
    Solar: {
      fromYmdHms(year: number, month: number, day: number, hour: number, minute: number, second: number): SolarDate;
    };
  };

  export default lunar;
}
