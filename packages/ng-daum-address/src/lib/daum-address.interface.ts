/**
 * Daum Postcode address search options
 */
export interface DaumAddressOptions {
  /**
   * Display type of the address search UI
   * - popup: Opens in a new popup window (default)
   * - layer: Displays as a centered overlay layer
   * - inline: Embeds inline within the page
   */
  type?: "popup" | "layer" | "inline";

  /**
   * CSS class(es) to apply to the trigger button
   */
  class?: string | string[];

  /**
   * Target element ID for layer/inline mode
   */
  target?: string;

  /**
   * Width of the layer (layer mode only)
   */
  width?: number;

  /**
   * Height of the layer (layer mode only)
   */
  height?: number;

  /**
   * Border width of the layer (layer mode only)
   */
  border?: number;

  /**
   * Enable debug mode for console logging
   */
  debug?: boolean;

  /**
   * Button text
   */
  buttonText?: string;
}

/**
 * Result data from Daum Postcode service
 */
export interface DaumAddressResult {
  /**
   * Postal code (5 digits)
   */
  zip: string;

  /**
   * Full Korean address
   */
  addr: string;

  /**
   * Full English address
   */
  addrEng: string;

  /**
   * Address type: 'R' for road-based, 'J' for lot-based
   */
  addressType: "R" | "J";

  /**
   * Road address in Korean
   */
  roadAddress: string;

  /**
   * Road address in English
   */
  roadAddressEnglish: string;

  /**
   * Lot-based address in Korean
   */
  jibunAddress: string;

  /**
   * Lot-based address in English
   */
  jibunAddressEnglish: string;

  /**
   * Building name
   */
  buildingName: string;

  /**
   * Apartment flag: 'Y' for apartment, 'N' otherwise
   */
  apartment: "Y" | "N";

  /**
   * Region code
   */
  bcode: string;

  /**
   * Road name code
   */
  roadnameCode: string;

  /**
   * Building code
   */
  buildingCode: string;

  /**
   * Sido (province/city)
   */
  sido: string;

  /**
   * Sigungu (city/district)
   */
  sigungu: string;

  /**
   * Sigungu code
   */
  sigunguCode: string;

  /**
   * Road name
   */
  roadname: string;

  /**
   * Bname (dong/ri)
   */
  bname: string;

  /**
   * Bname1 (large area name)
   */
  bname1: string;

  /**
   * Bname2 (small area name)
   */
  bname2: string;

  /**
   * User selection type: 'R' for road, 'J' for jibun
   */
  userSelectedType: "R" | "J";

  /**
   * User-selected language type: 'K' for Korean, 'E' for English
   */
  userLanguageType: "K" | "E";

  /**
   * Query string used for search
   */
  query: string;

  /**
   * Auto road address (with building name if applicable)
   */
  autoRoadAddress: string;

  /**
   * Auto road address in English
   */
  autoRoadAddressEnglish: string;

  /**
   * Auto jibun address (with building name if applicable)
   */
  autoJibunAddress: string;

  /**
   * Auto jibun address in English
   */
  autoJibunAddressEnglish: string;

  /**
   * No selected: 'Y' if no selection made
   */
  noSelected?: "Y";
}

/**
 * Raw data structure from Daum Postcode API
 */
export interface DaumPostcodeData {
  zonecode: string;
  address: string;
  addressEnglish: string;
  addressType: "R" | "J";
  roadAddress: string;
  roadAddressEnglish: string;
  jibunAddress: string;
  jibunAddressEnglish: string;
  buildingName: string;
  apartment: "Y" | "N";
  bcode: string;
  roadnameCode: string;
  buildingCode: string;
  sido: string;
  sigungu: string;
  sigunguCode: string;
  roadname: string;
  bname: string;
  bname1: string;
  bname2: string;
  userSelectedType: "R" | "J";
  userLanguageType: "K" | "E";
  query: string;
  autoRoadAddress: string;
  autoRoadAddressEnglish: string;
  autoJibunAddress: string;
  autoJibunAddressEnglish: string;
  noSelected?: "Y";
}

/**
 * Daum Postcode constructor options
 */
export interface DaumPostcodeOptions {
  oncomplete: (data: DaumPostcodeData) => void;
  onresize?: (size: { width: number; height: number }) => void;
  onclose?: (state: string) => void;
  onsearch?: (data: { q: string; count: number }) => void;
  width?: string | number;
  height?: string | number;
  animation?: boolean;
  focusInput?: boolean;
  autoMapping?: boolean;
  shorthand?: boolean;
  pleaseReadGuide?: number;
  pleaseReadGuideTimer?: number;
  maxSuggestItems?: number;
  showMoreHName?: boolean;
  hideMapBtn?: boolean;
  hideEngBtn?: boolean;
  alwaysShowEngAddr?: boolean;
  submitMode?: boolean;
  useSuggest?: boolean;
  theme?: Record<string, string>;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (
        options: DaumPostcodeOptions,
      ) => {
        open: (options?: {
          q?: string;
          left?: number;
          top?: number;
          popupName?: string;
          popupKey?: string;
          autoClose?: boolean;
        }) => void;
        embed: (element: HTMLElement, options?: { q?: string; autoClose?: boolean }) => void;
      };
    };
  }
}
