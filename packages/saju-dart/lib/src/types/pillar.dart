import 'enums.dart';

/// Represents a single pillar (柱, 기둥) consisting of a Heavenly Stem and Earthly Branch.
///
/// A pillar is the fundamental unit in Four Pillars of Destiny (사주),
/// combining one of ten stems with one of twelve branches to form
/// part of the 60-year sexagenary cycle.
class Pillar {
  const Pillar({
    required this.stem,
    required this.branch,
  });

  /// Create pillar from hanja string (e.g., "甲子")
  factory Pillar.fromHanja(String hanja) {
    if (hanja.length != 2) {
      throw ArgumentError('Pillar hanja must be 2 characters: $hanja');
    }
    return Pillar(
      stem: Stem.fromHanja(hanja[0]),
      branch: Branch.fromHanja(hanja[1]),
    );
  }

  /// Create pillar from sexagenary cycle index (0-59)
  factory Pillar.fromIndex(int index) {
    final normalizedIndex = ((index % 60) + 60) % 60;
    final stemIndex = normalizedIndex % 10;
    final branchIndex = normalizedIndex % 12;
    return Pillar(
      stem: Stem.values[stemIndex],
      branch: Branch.values[branchIndex],
    );
  }

  final Stem stem;
  final Branch branch;

  /// Get the sexagenary cycle index (0-59)
  int get index {
    final stemIdx = stem.index;
    final branchIdx = branch.index;
    // Find x where x % 10 == stemIdx and x % 12 == branchIdx
    for (var i = 0; i < 60; i++) {
      if (i % 10 == stemIdx && i % 12 == branchIdx) {
        return i;
      }
    }
    return 0;
  }

  /// Get the pillar as hanja string (e.g., "甲子")
  String get hanja => '${stem.hanja}${branch.hanja}';

  /// Get the pillar as korean string (e.g., "갑자")
  String get korean => '${stem.korean}${branch.korean}';

  @override
  String toString() => hanja;

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is Pillar && other.stem == stem && other.branch == branch;
  }

  @override
  int get hashCode => Object.hash(stem, branch);
}

/// The Four Pillars of Destiny (사주팔자, 四柱八字).
///
/// Represents the year, month, day, and hour pillars calculated from
/// a person's birth date and time. Each pillar contains a stem and branch,
/// totaling eight characters (八字).
class FourPillars {
  const FourPillars({
    required this.year,
    required this.month,
    required this.day,
    required this.hour,
  });

  /// The year pillar (년주, 年柱).
  final Pillar year;

  /// The month pillar (월주, 月柱).
  final Pillar month;

  /// The day pillar (일주, 日柱).
  final Pillar day;

  /// The hour pillar (시주, 時柱).
  final Pillar hour;

  /// Get the day master (일간)
  Stem get dayMaster => day.stem;

  /// Get pillar by position
  Pillar operator [](PillarPosition position) {
    return switch (position) {
      PillarPosition.year => year,
      PillarPosition.month => month,
      PillarPosition.day => day,
      PillarPosition.hour => hour,
    };
  }

  /// Get all stems
  List<Stem> get stems => [year.stem, month.stem, day.stem, hour.stem];

  /// Get all branches
  List<Branch> get branches =>
      [year.branch, month.branch, day.branch, hour.branch];

  Map<String, String> toMap() => {
        'year': year.hanja,
        'month': month.hanja,
        'day': day.hanja,
        'hour': hour.hanja,
      };

  @override
  String toString() =>
      'FourPillars(year: $year, month: $month, day: $day, hour: $hour)';
}
