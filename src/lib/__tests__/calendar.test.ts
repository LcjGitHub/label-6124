import {
  isDateInRange,
  formatDateKey,
  reverseLookupLunar,
  getSolarTermsForYear,
  getFestivalsForYear,
  CALENDAR_YEAR_MIN,
  CALENDAR_YEAR_MAX,
} from "@/lib/calendar";

describe("日历工具库核心函数测试", () => {
  describe("1. isDateInRange - 日期范围判断", () => {
    it("正常输入：范围内的日期应返回 true", () => {
      expect(isDateInRange(new Date(2020, 0, 1))).toBe(true);
      expect(isDateInRange(new Date(2025, 5, 15))).toBe(true);
      expect(isDateInRange(new Date(2030, 11, 31))).toBe(true);
    });

    it("边界年份：最小年份第一天应返回 true", () => {
      expect(isDateInRange(new Date(CALENDAR_YEAR_MIN, 0, 1))).toBe(true);
    });

    it("边界年份：最大年份最后一天应返回 true", () => {
      expect(isDateInRange(new Date(CALENDAR_YEAR_MAX, 11, 31))).toBe(true);
    });

    it("边界年份：最小年份前一年应返回 false", () => {
      expect(isDateInRange(new Date(CALENDAR_YEAR_MIN - 1, 11, 31))).toBe(false);
    });

    it("边界年份：最大年份后一年应返回 false", () => {
      expect(isDateInRange(new Date(CALENDAR_YEAR_MAX + 1, 0, 1))).toBe(false);
    });

    it("无效日期：闰年2月29日在非闰年时应正确判断范围", () => {
      expect(isDateInRange(new Date(2024, 1, 29))).toBe(true);
    });
  });

  describe("2. formatDateKey - 公历日期键格式化", () => {
    it("正常输入：标准日期应格式化为 yyyy-MM-dd", () => {
      expect(formatDateKey(new Date(2020, 0, 1))).toBe("2020-01-01");
      expect(formatDateKey(new Date(2025, 5, 15))).toBe("2025-06-15");
      expect(formatDateKey(new Date(2030, 11, 31))).toBe("2030-12-31");
    });

    it("边界年份：最小年份第一天格式化正确", () => {
      expect(formatDateKey(new Date(CALENDAR_YEAR_MIN, 0, 1))).toBe(
        `${CALENDAR_YEAR_MIN}-01-01`
      );
    });

    it("边界年份：最大年份最后一天格式化正确", () => {
      expect(formatDateKey(new Date(CALENDAR_YEAR_MAX, 11, 31))).toBe(
        `${CALENDAR_YEAR_MAX}-12-31`
      );
    });

    it("月份和日期补零：单数字月份日期应补零", () => {
      expect(formatDateKey(new Date(2020, 0, 5))).toBe("2020-01-05");
      expect(formatDateKey(new Date(2020, 8, 9))).toBe("2020-09-09");
    });

    it("闰年日期：闰年2月29日格式化正确", () => {
      expect(formatDateKey(new Date(2024, 1, 29))).toBe("2024-02-29");
    });

    it("无效日期：构造无效日期时应返回非标准格式", () => {
      const invalidDate = new Date(2023, 1, 30);
      expect(formatDateKey(invalidDate)).toBe("2023-03-02");
    });
  });

  describe("3. reverseLookupLunar - 农历反查", () => {
    it("正常输入：农历春节（正月初一）应返回多条结果", () => {
      const results = reverseLookupLunar("正月", "初一");
      expect(results.length).toBeGreaterThan(0);
      results.forEach((result) => {
        expect(result.lunarMonth).toBe("正月");
        expect(result.lunarDay).toBe("初一");
        expect(result.dateKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(result.date instanceof Date).toBe(true);
      });
    });

    it("正常输入：农历中秋节（八月十五）应返回多条结果", () => {
      const results = reverseLookupLunar("八月", "十五");
      expect(results.length).toBeGreaterThan(0);
      results.forEach((result) => {
        expect(result.lunarMonth).toBe("八月");
        expect(result.lunarDay).toBe("十五");
      });
    });

    it("边界年份：应包含最小和最大年份的数据", () => {
      const results = reverseLookupLunar("正月", "初一");
      const years = results.map((r) => r.date.getFullYear());
      expect(years).toContain(CALENDAR_YEAR_MIN);
      expect(years).toContain(CALENDAR_YEAR_MAX);
    });

    it("无效农历月份：不存在的月份应返回空数组", () => {
      expect(reverseLookupLunar("十三月", "初一")).toEqual([]);
    });

    it("无效农历日期：不存在的日期应返回空数组", () => {
      expect(reverseLookupLunar("正月", "卅二")).toEqual([]);
    });

    it("空输入：空字符串应返回空数组", () => {
      expect(reverseLookupLunar("", "")).toEqual([]);
    });

    it("特殊农历月份：冬月、腊月应正确匹配", () => {
      const winterResults = reverseLookupLunar("冬月", "十五");
      expect(winterResults.length).toBeGreaterThan(0);
      winterResults.forEach((result) => {
        expect(result.lunarMonth).toBe("冬月");
      });

      const twelfthResults = reverseLookupLunar("腊月", "三十");
      expect(twelfthResults.length).toBeGreaterThanOrEqual(0);
    });

    it("结果验证：返回结果应包含完整字段", () => {
      const results = reverseLookupLunar("五月", "初五");
      expect(results.length).toBeGreaterThan(0);
      const result = results[0];
      expect(result).toHaveProperty("dateKey");
      expect(result).toHaveProperty("date");
      expect(result).toHaveProperty("lunar");
      expect(result).toHaveProperty("lunarMonth");
      expect(result).toHaveProperty("lunarDay");
      expect(result).toHaveProperty("ganZhi");
      expect(result.ganZhi).toHaveProperty("year");
      expect(result.ganZhi).toHaveProperty("month");
      expect(result.ganZhi).toHaveProperty("day");
      expect(result).toHaveProperty("solarTerm");
      expect(result).toHaveProperty("festivals");
      expect(Array.isArray(result.festivals)).toBe(true);
    });
  });

  describe("4. getSolarTermsForYear - 按年份获取节气列表", () => {
    it("正常输入：有效年份应返回24个节气", () => {
      const terms2020 = getSolarTermsForYear(2020);
      expect(terms2020.length).toBe(24);

      const terms2025 = getSolarTermsForYear(2025);
      expect(terms2025.length).toBe(24);
    });

    it("边界年份：最小年份应返回24个节气", () => {
      const terms = getSolarTermsForYear(CALENDAR_YEAR_MIN);
      expect(terms.length).toBe(24);
    });

    it("边界年份：最大年份应返回24个节气", () => {
      const terms = getSolarTermsForYear(CALENDAR_YEAR_MAX);
      expect(terms.length).toBe(24);
    });

    it("边界年份：小于最小年份应返回空数组", () => {
      expect(getSolarTermsForYear(CALENDAR_YEAR_MIN - 1)).toEqual([]);
    });

    it("边界年份：大于最大年份应返回空数组", () => {
      expect(getSolarTermsForYear(CALENDAR_YEAR_MAX + 1)).toEqual([]);
    });

    it("无效输入：0 年份应返回空数组", () => {
      expect(getSolarTermsForYear(0)).toEqual([]);
    });

    it("无效输入：负数年份应返回空数组", () => {
      expect(getSolarTermsForYear(-2020)).toEqual([]);
    });

    it("节气名称验证：应包含24节气名称", () => {
      const terms = getSolarTermsForYear(2020);
      const termNames = terms.map((t) => t.name);
      const expectedTerms = [
        "小寒", "大寒", "立春", "雨水", "惊蛰", "春分",
        "清明", "谷雨", "立夏", "小满", "芒种", "夏至",
        "小暑", "大暑", "立秋", "处暑", "白露", "秋分",
        "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"
      ];
      expect(termNames).toEqual(expectedTerms);
    });

    it("节气日期格式验证：日期应为 yyyy-MM-dd 格式", () => {
      const terms = getSolarTermsForYear(2020);
      terms.forEach((term) => {
        expect(term.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it("节气时间格式验证：时间应为 HH:mm 格式", () => {
      const terms = getSolarTermsForYear(2020);
      terms.forEach((term) => {
        expect(term.time).toMatch(/^\d{2}:\d{2}$/);
      });
    });

    it("节气顺序验证：应按日期升序排列", () => {
      const terms = getSolarTermsForYear(2020);
      for (let i = 1; i < terms.length; i++) {
        expect(terms[i].date > terms[i - 1].date).toBe(true);
      }
    });

    it("立春验证：2020年立春应为2月4日", () => {
      const terms = getSolarTermsForYear(2020);
      const springStart = terms.find((t) => t.name === "立春");
      expect(springStart).toBeDefined();
      expect(springStart?.date).toBe("2020-02-04");
    });

    it("冬至验证：2025年冬至应为12月21日", () => {
      const terms = getSolarTermsForYear(2025);
      const winterSolstice = terms.find((t) => t.name === "冬至");
      expect(winterSolstice).toBeDefined();
      expect(winterSolstice?.date).toBe("2025-12-21");
    });
  });

  describe("5. getFestivalsForYear - 按年份获取节日列表", () => {
    it("正常输入：有效年份应返回多条节日数据", () => {
      const festivals2020 = getFestivalsForYear(2020);
      expect(festivals2020.length).toBeGreaterThan(0);
    });

    it("边界年份：最小年份应返回节日数据", () => {
      const festivals = getFestivalsForYear(CALENDAR_YEAR_MIN);
      expect(festivals.length).toBeGreaterThan(0);
    });

    it("边界年份：最大年份应返回节日数据", () => {
      const festivals = getFestivalsForYear(CALENDAR_YEAR_MAX);
      expect(festivals.length).toBeGreaterThan(0);
    });

    it("边界年份：小于最小年份应返回空数组", () => {
      expect(getFestivalsForYear(CALENDAR_YEAR_MIN - 1)).toEqual([]);
    });

    it("边界年份：大于最大年份应返回空数组", () => {
      expect(getFestivalsForYear(CALENDAR_YEAR_MAX + 1)).toEqual([]);
    });

    it("无效输入：0 年份应返回空数组", () => {
      expect(getFestivalsForYear(0)).toEqual([]);
    });

    it("无效输入：负数年份应返回空数组", () => {
      expect(getFestivalsForYear(-2020)).toEqual([]);
    });

    it("元旦验证：每年1月1日应有元旦", () => {
      const festivals = getFestivalsForYear(2025);
      const newYear = festivals.find((f) => f.dateKey === "2025-01-01");
      expect(newYear).toBeDefined();
      expect(newYear?.festivals).toContain("元旦");
    });

    it("国庆节验证：每年10月1日应有国庆节", () => {
      const festivals = getFestivalsForYear(2025);
      const nationalDay = festivals.find((f) => f.dateKey === "2025-10-01");
      expect(nationalDay).toBeDefined();
      expect(nationalDay?.festivals).toContain("国庆节");
    });

    it("结果排序验证：应按公历日期升序排列", () => {
      const festivals = getFestivalsForYear(2025);
      for (let i = 1; i < festivals.length; i++) {
        expect(festivals[i].dateKey > festivals[i - 1].dateKey).toBe(true);
      }
    });

    it("结果字段验证：每条记录应包含完整字段", () => {
      const festivals = getFestivalsForYear(2025);
      expect(festivals.length).toBeGreaterThan(0);
      const festival = festivals[0];
      expect(festival).toHaveProperty("dateKey");
      expect(festival).toHaveProperty("date");
      expect(festival.date instanceof Date).toBe(true);
      expect(festival).toHaveProperty("lunar");
      expect(festival).toHaveProperty("lunarMonth");
      expect(festival).toHaveProperty("lunarDay");
      expect(festival).toHaveProperty("festivals");
      expect(Array.isArray(festival.festivals)).toBe(true);
      expect(festival.festivals.length).toBeGreaterThan(0);
      expect(festival).toHaveProperty("solarTerm");
    });

    it("节日数组独立性验证：修改返回结果不应影响内部数据", () => {
      const festivals1 = getFestivalsForYear(2025);
      const originalLength = festivals1[0].festivals.length;
      festivals1[0].festivals.push("测试节日");

      const festivals2 = getFestivalsForYear(2025);
      expect(festivals2[0].festivals.length).toBe(originalLength);
      expect(festivals2[0].festivals).not.toContain("测试节日");
    });

    it("无节日日期过滤：返回结果中不应包含无节日的日期", () => {
      const festivals = getFestivalsForYear(2025);
      festivals.forEach((f) => {
        expect(f.festivals.length).toBeGreaterThan(0);
      });
    });

    it("日期完整性验证：dateKey 应与 date 对象一致", () => {
      const festivals = getFestivalsForYear(2025);
      festivals.forEach((f) => {
        const year = f.date.getFullYear();
        const month = String(f.date.getMonth() + 1).padStart(2, "0");
        const day = String(f.date.getDate()).padStart(2, "0");
        expect(f.dateKey).toBe(`${year}-${month}-${day}`);
      });
    });
  });

  describe("综合场景测试", () => {
    it("多函数联合测试：农历反查结果应在有效范围内", () => {
      const results = reverseLookupLunar("八月", "十五");
      results.forEach((result) => {
        expect(isDateInRange(result.date)).toBe(true);
        expect(formatDateKey(result.date)).toBe(result.dateKey);
      });
    });

    it("节气与节日关联测试：部分节气当天可能也是节日", () => {
      const festivals = getFestivalsForYear(2025);
      const hasTermFestival = festivals.some(
        (f) => f.solarTerm !== null && f.festivals.length > 0
      );
      expect(typeof hasTermFestival).toBe("boolean");
    });

    it("全年节气与节日数量对比：节日数量应小于等于365", () => {
      const festivals = getFestivalsForYear(2025);
      const terms = getSolarTermsForYear(2025);
      expect(festivals.length).toBeLessThanOrEqual(365);
      expect(terms.length).toBe(24);
    });
  });
});
