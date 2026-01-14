import 'package:lunar/lunar.dart';
import 'package:timezone/timezone.dart' as tz;

import 'core/core.dart';
import 'types/types.dart';

export 'core/core.dart';
export 'types/types.dart';

/// Lunar date information derived from a solar (Gregorian) date.
///
/// Contains the lunar calendar year, month, day, and the GanZhi (干支)
/// representations for year, month, and day.
class LunarDate {
  const LunarDate({
    required this.year,
    required this.month,
    required this.day,
    required this.isLeapMonth,
    required this.yearGanZhi,
    required this.monthGanZhi,
    required this.dayGanZhi,
  });

  /// The lunar year.
  final int year;

  /// The lunar month (1-12).
  final int month;

  /// The lunar day of the month.
  final int day;

  /// Whether this date falls in a leap month.
  final bool isLeapMonth;

  /// The year's GanZhi (干支) representation (e.g., "甲子").
  final String yearGanZhi;

  /// The month's GanZhi (干支) representation.
  final String monthGanZhi;

  /// The day's GanZhi (干支) representation.
  final String dayGanZhi;
}

/// Get lunar date from solar date
LunarDate getLunarDate(int year, int month, int day) {
  final solar = Solar.fromYmd(year, month, day);
  final lunar = solar.getLunar();

  return LunarDate(
    year: lunar.getYear(),
    month: lunar.getMonth().abs(),
    day: lunar.getDay(),
    isLeapMonth: lunar.getMonth() < 0,
    yearGanZhi: lunar.getYearInGanZhi(),
    monthGanZhi: lunar.getMonthInGanZhi(),
    dayGanZhi: lunar.getDayInGanZhi(),
  );
}

/// Complete Saju (Four Pillars of Destiny) analysis result.
///
/// This class aggregates all analysis components including the four pillars,
/// ten gods, strength assessment, relations, yongshen, solar terms, and luck cycles.
class SajuResult {
  const SajuResult({
    required this.pillars,
    required this.lunar,
    required this.tenGods,
    required this.strength,
    required this.relations,
    required this.yongShen,
    required this.solarTerms,
    required this.majorLuck,
    required this.yearlyLuck,
    required this.twelveStages,
    required this.meta,
  });

  /// The four pillars (year, month, day, hour).
  final FourPillars pillars;

  /// The lunar date corresponding to the birth date.
  final LunarDate lunar;

  /// Ten gods (십신) analysis for each pillar.
  final FourPillarsTenGods tenGods;

  /// Day master strength (신강신약) assessment.
  final StrengthResult strength;

  /// Relations analysis (combinations, clashes, harms, punishments).
  final RelationsResult relations;

  /// Yongshen (용신) - the favorable element for balancing the chart.
  final YongShenResult yongShen;

  /// Solar terms (절기) information for the birth date.
  final SolarTermInfo solarTerms;

  /// Major luck (대운) cycles.
  final MajorLuckResult majorLuck;

  /// Yearly luck (세운) for specified years.
  final List<YearlyLuckResult> yearlyLuck;

  /// Twelve life stages (십이운성) analysis.
  final TwelveStagesResult twelveStages;

  /// Metadata about the calculation.
  final SajuMeta meta;
}

/// Metadata about the Saju calculation process.
///
/// Contains technical details used during pillar calculation.
class SajuMeta {
  const SajuMeta({
    required this.solarYearUsed,
    required this.sunLonDeg,
    required this.effectiveDayDate,
    required this.adjustedDtForHour,
  });

  /// The solar year used for year pillar calculation (may differ from calendar year near Lichun).
  final int solarYearUsed;

  /// The sun's apparent longitude in degrees at the birth time.
  final double sunLonDeg;

  /// The effective date used for day pillar calculation (adjusted for day boundary rules).
  final ({int year, int month, int day}) effectiveDayDate;

  /// The adjusted datetime used for hour pillar calculation (may include mean solar time correction).
  final tz.TZDateTime adjustedDtForHour;
}

/// Calculates a complete Saju (Four Pillars of Destiny) analysis.
///
/// Returns a [SajuResult] containing all analysis components.
///
/// Parameters:
/// - [dtLocal]: The birth datetime in the local timezone.
/// - [gender]: The person's gender (affects major luck direction).
/// - [longitudeDeg]: Geographic longitude for mean solar time correction (optional).
/// - [tzOffsetHours]: Timezone offset in hours (default: 9.0 for KST).
/// - [preset]: Pillar calculation preset (default: [standardPreset]).
/// - [currentYear]: Year to use for yearly luck calculation (default: current year).
/// - [yearlyLuckRange]: Custom range for yearly luck calculation.
SajuResult getSaju(
  tz.TZDateTime dtLocal, {
  required Gender gender,
  double? longitudeDeg,
  double tzOffsetHours = 9.0,
  PillarPreset preset = standardPreset,
  int? currentYear,
  ({int from, int to})? yearlyLuckRange,
}) {
  // Calculate four pillars
  final fourPillarsResult = getFourPillars(
    dtLocal,
    longitudeDeg: longitudeDeg,
    tzOffsetHours: tzOffsetHours,
    preset: preset,
  );

  final pillars = fourPillarsResult.pillars;

  // Analyze components
  final tenGods = analyzeTenGods(pillars);
  final strength = analyzeStrength(pillars);
  final relations = analyzeRelations(pillars);
  final yongShen = analyzeYongShen(pillars);
  final solarTerms = analyzeSolarTerms(dtLocal);
  final twelveStages = analyzeTwelveStages(pillars);

  // Calculate luck
  final majorLuck = calculateMajorLuck(
    birthMillis: dtLocal.millisecondsSinceEpoch,
    gender: gender,
    yearPillar: pillars.year,
    monthPillar: pillars.month,
    nextJieMillis: solarTerms.nextJieMillis,
    prevJieMillis: solarTerms.prevJieMillis,
  );

  final effectiveCurrentYear = currentYear ?? DateTime.now().year;
  final yearlyLuck = calculateYearlyLuck(
    fourPillarsResult.solarYear,
    yearlyLuckRange?.from ?? effectiveCurrentYear - 5,
    yearlyLuckRange?.to ?? effectiveCurrentYear + 10,
  );

  // Get lunar date
  final effDate = fourPillarsResult.effectiveDayDate;
  final lunar = getLunarDate(effDate.year, effDate.month, effDate.day);

  return SajuResult(
    pillars: pillars,
    lunar: lunar,
    tenGods: tenGods,
    strength: strength,
    relations: relations,
    yongShen: yongShen,
    solarTerms: solarTerms,
    majorLuck: majorLuck,
    yearlyLuck: yearlyLuck,
    twelveStages: twelveStages,
    meta: SajuMeta(
      solarYearUsed: fourPillarsResult.solarYear,
      sunLonDeg: fourPillarsResult.sunLonDeg,
      effectiveDayDate: effDate,
      adjustedDtForHour: fourPillarsResult.adjustedDtForHour,
    ),
  );
}
