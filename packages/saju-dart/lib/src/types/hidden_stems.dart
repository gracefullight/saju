import 'enums.dart';

/// A hidden stem (지장간, 支藏干) contained within an Earthly Branch.
///
/// Each branch contains one to three hidden stems with different weights,
/// representing the internal energy composition of the branch.
class HiddenStem {
  const HiddenStem({
    required this.stem,
    required this.weight,
    required this.type,
  });

  /// The Heavenly Stem hidden within the branch.
  final Stem stem;

  /// The relative weight/strength of this hidden stem (0.0-1.0).
  final double weight;

  /// The type of hidden stem (primary, secondary, or tertiary).
  final HiddenStemType type;
}

/// The classification of hidden stems within an Earthly Branch.
///
/// - [primary] (본기, 本氣): The main/dominant hidden stem.
/// - [secondary] (중기, 中氣): The middle hidden stem.
/// - [tertiary] (여기, 餘氣): The residual hidden stem.
enum HiddenStemType {
  primary('primary', '본기', '本氣'),
  secondary('secondary', '중기', '中氣'),
  tertiary('tertiary', '여기', '餘氣');

  const HiddenStemType(this.key, this.korean, this.hanja);

  final String key;
  final String korean;
  final String hanja;
}

/// Provides access to hidden stems (지장간) data for each Earthly Branch.
///
/// This class contains the complete mapping of all twelve branches to their
/// respective hidden stems, following traditional Four Pillars conventions.
class HiddenStems {
  HiddenStems._();

  /// The complete hidden stems data for all twelve Earthly Branches.
  static const Map<Branch, List<HiddenStem>> data = {
    Branch.zi: [
      HiddenStem(stem: Stem.gui, weight: 1.0, type: HiddenStemType.primary),
    ],
    Branch.chou: [
      HiddenStem(stem: Stem.ji, weight: 0.6, type: HiddenStemType.primary),
      HiddenStem(stem: Stem.gui, weight: 0.25, type: HiddenStemType.secondary),
      HiddenStem(stem: Stem.xin, weight: 0.15, type: HiddenStemType.tertiary),
    ],
    Branch.yin: [
      HiddenStem(stem: Stem.jia, weight: 0.6, type: HiddenStemType.primary),
      HiddenStem(stem: Stem.bing, weight: 0.25, type: HiddenStemType.secondary),
      HiddenStem(stem: Stem.wu, weight: 0.15, type: HiddenStemType.tertiary),
    ],
    Branch.mao: [
      HiddenStem(stem: Stem.yi, weight: 1.0, type: HiddenStemType.primary),
    ],
    Branch.chen: [
      HiddenStem(stem: Stem.wu, weight: 0.6, type: HiddenStemType.primary),
      HiddenStem(stem: Stem.yi, weight: 0.25, type: HiddenStemType.secondary),
      HiddenStem(stem: Stem.gui, weight: 0.15, type: HiddenStemType.tertiary),
    ],
    Branch.si: [
      HiddenStem(stem: Stem.bing, weight: 0.6, type: HiddenStemType.primary),
      HiddenStem(stem: Stem.geng, weight: 0.25, type: HiddenStemType.secondary),
      HiddenStem(stem: Stem.wu, weight: 0.15, type: HiddenStemType.tertiary),
    ],
    Branch.wu: [
      HiddenStem(stem: Stem.ding, weight: 0.7, type: HiddenStemType.primary),
      HiddenStem(stem: Stem.ji, weight: 0.3, type: HiddenStemType.secondary),
    ],
    Branch.wei: [
      HiddenStem(stem: Stem.ji, weight: 0.6, type: HiddenStemType.primary),
      HiddenStem(stem: Stem.ding, weight: 0.25, type: HiddenStemType.secondary),
      HiddenStem(stem: Stem.yi, weight: 0.15, type: HiddenStemType.tertiary),
    ],
    Branch.shen: [
      HiddenStem(stem: Stem.geng, weight: 0.6, type: HiddenStemType.primary),
      HiddenStem(stem: Stem.ren, weight: 0.25, type: HiddenStemType.secondary),
      HiddenStem(stem: Stem.wu, weight: 0.15, type: HiddenStemType.tertiary),
    ],
    Branch.you: [
      HiddenStem(stem: Stem.xin, weight: 1.0, type: HiddenStemType.primary),
    ],
    Branch.xu: [
      HiddenStem(stem: Stem.wu, weight: 0.6, type: HiddenStemType.primary),
      HiddenStem(stem: Stem.xin, weight: 0.25, type: HiddenStemType.secondary),
      HiddenStem(stem: Stem.ding, weight: 0.15, type: HiddenStemType.tertiary),
    ],
    Branch.hai: [
      HiddenStem(stem: Stem.ren, weight: 0.7, type: HiddenStemType.primary),
      HiddenStem(stem: Stem.jia, weight: 0.3, type: HiddenStemType.secondary),
    ],
  };

  /// Get hidden stems for a branch
  static List<HiddenStem> forBranch(Branch branch) {
    return data[branch] ?? [];
  }

  /// Get primary hidden stem for a branch
  static Stem primaryStem(Branch branch) {
    final stems = data[branch];
    if (stems == null || stems.isEmpty) {
      throw ArgumentError('No hidden stems for branch: $branch');
    }
    return stems.first.stem;
  }
}
