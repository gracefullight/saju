import type { DaumAddressResult, DaumPostcodeData } from "./daum-address.interface";

/**
 * Transforms raw Daum Postcode API data into a structured result object.
 *
 * This function handles:
 * - Selecting the appropriate address based on user's selection type (road or jibun)
 * - Appending building name for apartment addresses
 * - Mapping all relevant fields from the raw data
 *
 * @param data - Raw data from Daum Postcode API
 * @returns Structured address result
 *
 * @example
 * ```typescript
 * const result = transformPostcodeData(rawData);
 * console.log(result.addr); // Full Korean address
 * console.log(result.zip);  // Postal code
 * ```
 */
export function transformPostcodeData(data: DaumPostcodeData): DaumAddressResult {
  let fullAddr = "";
  let fullAddrEng = "";

  if (data.userSelectedType === "R") {
    fullAddr = data.roadAddress;
    fullAddrEng = data.roadAddressEnglish;
  } else {
    fullAddr = data.jibunAddress;
    fullAddrEng = data.jibunAddressEnglish;
  }

  // Add building name for apartment addresses
  if (data.apartment === "Y" && data.buildingName) {
    fullAddr += ` (${data.buildingName})`;
  }

  return {
    zip: data.zonecode,
    addr: fullAddr,
    addrEng: fullAddrEng,
    addressType: data.addressType,
    roadAddress: data.roadAddress,
    roadAddressEnglish: data.roadAddressEnglish,
    jibunAddress: data.jibunAddress,
    jibunAddressEnglish: data.jibunAddressEnglish,
    buildingName: data.buildingName,
    apartment: data.apartment,
    bcode: data.bcode,
    roadnameCode: data.roadnameCode,
    buildingCode: data.buildingCode,
    sido: data.sido,
    sigungu: data.sigungu,
    sigunguCode: data.sigunguCode,
    roadname: data.roadname,
    bname: data.bname,
    bname1: data.bname1,
    bname2: data.bname2,
    userSelectedType: data.userSelectedType,
    userLanguageType: data.userLanguageType,
    query: data.query,
    autoRoadAddress: data.autoRoadAddress,
    autoRoadAddressEnglish: data.autoRoadAddressEnglish,
    autoJibunAddress: data.autoJibunAddress,
    autoJibunAddressEnglish: data.autoJibunAddressEnglish,
    noSelected: data.noSelected,
  };
}

/**
 * Layer mode position options validation
 */
export interface LayerPositionOptions {
  width?: number;
  height?: number;
  border?: number;
}

/**
 * Validates and returns layer position options with defaults
 *
 * @param options - Optional layer position configuration
 * @returns Validated options with default values applied
 */
export function getLayerPositionDefaults(
  options?: LayerPositionOptions,
): Required<LayerPositionOptions> {
  return {
    width: options?.width ?? 400,
    height: options?.height ?? 500,
    border: options?.border ?? 5,
  };
}

/**
 * Calculates the centered position for a layer element
 *
 * @param windowWidth - Current window inner width
 * @param windowHeight - Current window inner height
 * @param layerWidth - Layer element width
 * @param layerHeight - Layer element height
 * @param border - Border width
 * @returns Object with left and top positions
 */
export function calculateLayerPosition(
  windowWidth: number,
  windowHeight: number,
  layerWidth: number,
  layerHeight: number,
  border: number,
): { left: number; top: number } {
  return {
    left: (windowWidth - layerWidth) / 2 - border,
    top: (windowHeight - layerHeight) / 2 - border,
  };
}
