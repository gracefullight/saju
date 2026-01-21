import { describe, expect, it } from "vitest";
import type { DaumAddressOptions, DaumPostcodeData } from "@/lib/daum-address.interface";
import {
  calculateLayerPosition,
  getLayerPositionDefaults,
  transformPostcodeData,
} from "@/lib/daum-address.utils";

describe("transformPostcodeData", () => {
  describe("Address Type Selection", () => {
    it("should use road address when userSelectedType is R", () => {
      const mockData: DaumPostcodeData = {
        zonecode: "12345",
        address: "서울특별시 강남구 테헤란로 123",
        addressEnglish: "123, Teheran-ro, Gangnam-gu, Seoul",
        addressType: "R",
        roadAddress: "서울특별시 강남구 테헤란로 123",
        roadAddressEnglish: "123, Teheran-ro, Gangnam-gu, Seoul",
        jibunAddress: "서울특별시 강남구 역삼동 123-45",
        jibunAddressEnglish: "123-45, Yeoksam-dong, Gangnam-gu, Seoul",
        buildingName: "",
        apartment: "N",
        bcode: "1168010100",
        roadnameCode: "4155333",
        buildingCode: "1168010100123450000000001",
        sido: "서울특별시",
        sigungu: "강남구",
        sigunguCode: "11680",
        roadname: "테헤란로",
        bname: "역삼동",
        bname1: "",
        bname2: "역삼동",
        userSelectedType: "R",
        userLanguageType: "K",
        query: "테헤란로 123",
        autoRoadAddress: "",
        autoRoadAddressEnglish: "",
        autoJibunAddress: "",
        autoJibunAddressEnglish: "",
      };

      const result = transformPostcodeData(mockData);

      expect(result.zipCode).toBe("12345");
      expect(result.addr).toBe("서울특별시 강남구 테헤란로 123");
      expect(result.addrEng).toBe("123, Teheran-ro, Gangnam-gu, Seoul");
      expect(result.userSelectedType).toBe("R");
    });

    it("should use jibun address when userSelectedType is J", () => {
      const mockData: DaumPostcodeData = {
        zonecode: "12345",
        address: "서울특별시 강남구 역삼동 123-45",
        addressEnglish: "123-45, Yeoksam-dong, Gangnam-gu, Seoul",
        addressType: "J",
        roadAddress: "서울특별시 강남구 테헤란로 123",
        roadAddressEnglish: "123, Teheran-ro, Gangnam-gu, Seoul",
        jibunAddress: "서울특별시 강남구 역삼동 123-45",
        jibunAddressEnglish: "123-45, Yeoksam-dong, Gangnam-gu, Seoul",
        buildingName: "",
        apartment: "N",
        bcode: "1168010100",
        roadnameCode: "4155333",
        buildingCode: "1168010100123450000000001",
        sido: "서울특별시",
        sigungu: "강남구",
        sigunguCode: "11680",
        roadname: "테헤란로",
        bname: "역삼동",
        bname1: "",
        bname2: "역삼동",
        userSelectedType: "J",
        userLanguageType: "K",
        query: "역삼동 123-45",
        autoRoadAddress: "",
        autoRoadAddressEnglish: "",
        autoJibunAddress: "",
        autoJibunAddressEnglish: "",
      };

      const result = transformPostcodeData(mockData);

      expect(result.addr).toBe("서울특별시 강남구 역삼동 123-45");
      expect(result.addrEng).toBe("123-45, Yeoksam-dong, Gangnam-gu, Seoul");
      expect(result.userSelectedType).toBe("J");
    });
  });

  describe("Apartment Building Name", () => {
    it("should append building name for apartment addresses", () => {
      const mockData: DaumPostcodeData = {
        zonecode: "12345",
        address: "서울특별시 강남구 테헤란로 123",
        addressEnglish: "123, Teheran-ro, Gangnam-gu, Seoul",
        addressType: "R",
        roadAddress: "서울특별시 강남구 테헤란로 123",
        roadAddressEnglish: "123, Teheran-ro, Gangnam-gu, Seoul",
        jibunAddress: "서울특별시 강남구 역삼동 123-45",
        jibunAddressEnglish: "123-45, Yeoksam-dong, Gangnam-gu, Seoul",
        buildingName: "테스트아파트",
        apartment: "Y",
        bcode: "1168010100",
        roadnameCode: "4155333",
        buildingCode: "1168010100123450000000001",
        sido: "서울특별시",
        sigungu: "강남구",
        sigunguCode: "11680",
        roadname: "테헤란로",
        bname: "역삼동",
        bname1: "",
        bname2: "역삼동",
        userSelectedType: "R",
        userLanguageType: "K",
        query: "테헤란로 123",
        autoRoadAddress: "",
        autoRoadAddressEnglish: "",
        autoJibunAddress: "",
        autoJibunAddressEnglish: "",
      };

      const result = transformPostcodeData(mockData);

      expect(result.addr).toBe("서울특별시 강남구 테헤란로 123 (테스트아파트)");
      expect(result.apartment).toBe("Y");
      expect(result.buildingName).toBe("테스트아파트");
    });

    it("should not append building name for non-apartment addresses", () => {
      const mockData: DaumPostcodeData = {
        zonecode: "12345",
        address: "서울특별시 강남구 테헤란로 123",
        addressEnglish: "123, Teheran-ro, Gangnam-gu, Seoul",
        addressType: "R",
        roadAddress: "서울특별시 강남구 테헤란로 123",
        roadAddressEnglish: "123, Teheran-ro, Gangnam-gu, Seoul",
        jibunAddress: "서울특별시 강남구 역삼동 123-45",
        jibunAddressEnglish: "123-45, Yeoksam-dong, Gangnam-gu, Seoul",
        buildingName: "일반건물",
        apartment: "N",
        bcode: "1168010100",
        roadnameCode: "4155333",
        buildingCode: "1168010100123450000000001",
        sido: "서울특별시",
        sigungu: "강남구",
        sigunguCode: "11680",
        roadname: "테헤란로",
        bname: "역삼동",
        bname1: "",
        bname2: "역삼동",
        userSelectedType: "R",
        userLanguageType: "K",
        query: "테헤란로 123",
        autoRoadAddress: "",
        autoRoadAddressEnglish: "",
        autoJibunAddress: "",
        autoJibunAddressEnglish: "",
      };

      const result = transformPostcodeData(mockData);

      expect(result.addr).toBe("서울특별시 강남구 테헤란로 123");
      expect(result.apartment).toBe("N");
    });

    it("should not append building name when building name is empty", () => {
      const mockData: DaumPostcodeData = {
        zonecode: "12345",
        address: "서울특별시 강남구 테헤란로 123",
        addressEnglish: "123, Teheran-ro, Gangnam-gu, Seoul",
        addressType: "R",
        roadAddress: "서울특별시 강남구 테헤란로 123",
        roadAddressEnglish: "123, Teheran-ro, Gangnam-gu, Seoul",
        jibunAddress: "서울특별시 강남구 역삼동 123-45",
        jibunAddressEnglish: "123-45, Yeoksam-dong, Gangnam-gu, Seoul",
        buildingName: "",
        apartment: "Y",
        bcode: "1168010100",
        roadnameCode: "4155333",
        buildingCode: "1168010100123450000000001",
        sido: "서울특별시",
        sigungu: "강남구",
        sigunguCode: "11680",
        roadname: "테헤란로",
        bname: "역삼동",
        bname1: "",
        bname2: "역삼동",
        userSelectedType: "R",
        userLanguageType: "K",
        query: "테헤란로 123",
        autoRoadAddress: "",
        autoRoadAddressEnglish: "",
        autoJibunAddress: "",
        autoJibunAddressEnglish: "",
      };

      const result = transformPostcodeData(mockData);

      expect(result.addr).toBe("서울특별시 강남구 테헤란로 123");
    });
  });

  describe("Result Data Mapping", () => {
    it("should correctly map all postcode data fields to result", () => {
      const mockData: DaumPostcodeData = {
        zonecode: "06241",
        address: "서울특별시 강남구 테헤란로 152",
        addressEnglish: "152, Teheran-ro, Gangnam-gu, Seoul, Korea",
        addressType: "R",
        roadAddress: "서울특별시 강남구 테헤란로 152",
        roadAddressEnglish: "152, Teheran-ro, Gangnam-gu, Seoul, Korea",
        jibunAddress: "서울특별시 강남구 역삼동 737",
        jibunAddressEnglish: "737, Yeoksam-dong, Gangnam-gu, Seoul, Korea",
        buildingName: "강남파이낸스센터",
        apartment: "N",
        bcode: "1168010100",
        roadnameCode: "4155333",
        buildingCode: "1168010100107370001000001",
        sido: "서울특별시",
        sigungu: "강남구",
        sigunguCode: "11680",
        roadname: "테헤란로",
        bname: "역삼동",
        bname1: "역삼1동",
        bname2: "역삼동",
        userSelectedType: "R",
        userLanguageType: "K",
        query: "강남파이낸스센터",
        autoRoadAddress: "서울특별시 강남구 테헤란로 152 (역삼동)",
        autoRoadAddressEnglish: "152, Teheran-ro, Gangnam-gu, Seoul, Korea",
        autoJibunAddress: "서울특별시 강남구 역삼동 737",
        autoJibunAddressEnglish: "737, Yeoksam-dong, Gangnam-gu, Seoul, Korea",
      };

      const result = transformPostcodeData(mockData);

      expect(result.zipCode).toBe("06241");
      expect(result.addressType).toBe("R");
      expect(result.roadAddress).toBe("서울특별시 강남구 테헤란로 152");
      expect(result.roadAddressEnglish).toBe("152, Teheran-ro, Gangnam-gu, Seoul, Korea");
      expect(result.jibunAddress).toBe("서울특별시 강남구 역삼동 737");
      expect(result.jibunAddressEnglish).toBe("737, Yeoksam-dong, Gangnam-gu, Seoul, Korea");
      expect(result.buildingName).toBe("강남파이낸스센터");
      expect(result.bcode).toBe("1168010100");
      expect(result.roadnameCode).toBe("4155333");
      expect(result.buildingCode).toBe("1168010100107370001000001");
      expect(result.sido).toBe("서울특별시");
      expect(result.sigungu).toBe("강남구");
      expect(result.sigunguCode).toBe("11680");
      expect(result.roadname).toBe("테헤란로");
      expect(result.bname).toBe("역삼동");
      expect(result.bname1).toBe("역삼1동");
      expect(result.bname2).toBe("역삼동");
      expect(result.userLanguageType).toBe("K");
      expect(result.query).toBe("강남파이낸스센터");
      expect(result.autoRoadAddress).toBe("서울특별시 강남구 테헤란로 152 (역삼동)");
      expect(result.autoJibunAddress).toBe("서울특별시 강남구 역삼동 737");
    });

    it("should handle noSelected field when present", () => {
      const mockData: DaumPostcodeData = {
        zonecode: "12345",
        address: "",
        addressEnglish: "",
        addressType: "R",
        roadAddress: "",
        roadAddressEnglish: "",
        jibunAddress: "",
        jibunAddressEnglish: "",
        buildingName: "",
        apartment: "N",
        bcode: "",
        roadnameCode: "",
        buildingCode: "",
        sido: "",
        sigungu: "",
        sigunguCode: "",
        roadname: "",
        bname: "",
        bname1: "",
        bname2: "",
        userSelectedType: "R",
        userLanguageType: "K",
        query: "",
        autoRoadAddress: "",
        autoRoadAddressEnglish: "",
        autoJibunAddress: "",
        autoJibunAddressEnglish: "",
        noSelected: "Y",
      };

      const result = transformPostcodeData(mockData);

      expect(result.noSelected).toBe("Y");
    });
  });

  describe("English Address Support", () => {
    it("should handle English user language type", () => {
      const mockData: DaumPostcodeData = {
        zonecode: "06241",
        address: "152, Teheran-ro, Gangnam-gu, Seoul",
        addressEnglish: "152, Teheran-ro, Gangnam-gu, Seoul",
        addressType: "R",
        roadAddress: "서울특별시 강남구 테헤란로 152",
        roadAddressEnglish: "152, Teheran-ro, Gangnam-gu, Seoul",
        jibunAddress: "서울특별시 강남구 역삼동 737",
        jibunAddressEnglish: "737, Yeoksam-dong, Gangnam-gu, Seoul",
        buildingName: "Gangnam Finance Center",
        apartment: "N",
        bcode: "1168010100",
        roadnameCode: "4155333",
        buildingCode: "1168010100107370001000001",
        sido: "Seoul",
        sigungu: "Gangnam-gu",
        sigunguCode: "11680",
        roadname: "Teheran-ro",
        bname: "Yeoksam-dong",
        bname1: "",
        bname2: "Yeoksam-dong",
        userSelectedType: "R",
        userLanguageType: "E",
        query: "Gangnam Finance Center",
        autoRoadAddress: "",
        autoRoadAddressEnglish: "152, Teheran-ro, Gangnam-gu, Seoul",
        autoJibunAddress: "",
        autoJibunAddressEnglish: "737, Yeoksam-dong, Gangnam-gu, Seoul",
      };

      const result = transformPostcodeData(mockData);

      expect(result.userLanguageType).toBe("E");
      expect(result.addrEng).toBe("152, Teheran-ro, Gangnam-gu, Seoul");
    });
  });
});

describe("getLayerPositionDefaults", () => {
  it("should return all default values when no options provided", () => {
    const result = getLayerPositionDefaults();

    expect(result.width).toBe(400);
    expect(result.height).toBe(500);
    expect(result.border).toBe(5);
  });

  it("should return all default values when empty options provided", () => {
    const result = getLayerPositionDefaults({});

    expect(result.width).toBe(400);
    expect(result.height).toBe(500);
    expect(result.border).toBe(5);
  });

  it("should use custom width when provided", () => {
    const result = getLayerPositionDefaults({ width: 600 });

    expect(result.width).toBe(600);
    expect(result.height).toBe(500);
    expect(result.border).toBe(5);
  });

  it("should use custom height when provided", () => {
    const result = getLayerPositionDefaults({ height: 700 });

    expect(result.width).toBe(400);
    expect(result.height).toBe(700);
    expect(result.border).toBe(5);
  });

  it("should use custom border when provided", () => {
    const result = getLayerPositionDefaults({ border: 10 });

    expect(result.width).toBe(400);
    expect(result.height).toBe(500);
    expect(result.border).toBe(10);
  });

  it("should use all custom values when provided", () => {
    const result = getLayerPositionDefaults({ width: 800, height: 600, border: 3 });

    expect(result.width).toBe(800);
    expect(result.height).toBe(600);
    expect(result.border).toBe(3);
  });
});

describe("calculateLayerPosition", () => {
  it("should calculate centered position correctly", () => {
    const result = calculateLayerPosition(1920, 1080, 400, 500, 5);

    expect(result.left).toBe((1920 - 400) / 2 - 5); // 755
    expect(result.top).toBe((1080 - 500) / 2 - 5); // 285
  });

  it("should handle small window sizes", () => {
    const result = calculateLayerPosition(800, 600, 400, 500, 5);

    expect(result.left).toBe((800 - 400) / 2 - 5); // 195
    expect(result.top).toBe((600 - 500) / 2 - 5); // 45
  });

  it("should handle zero border", () => {
    const result = calculateLayerPosition(1920, 1080, 400, 500, 0);

    expect(result.left).toBe((1920 - 400) / 2); // 760
    expect(result.top).toBe((1080 - 500) / 2); // 290
  });

  it("should handle layer larger than window (negative position)", () => {
    const result = calculateLayerPosition(300, 400, 500, 600, 5);

    expect(result.left).toBe((300 - 500) / 2 - 5); // -105
    expect(result.top).toBe((400 - 600) / 2 - 5); // -105
  });
});

describe("DaumAddressOptions Interface", () => {
  it("should accept valid popup type options", () => {
    const options: DaumAddressOptions = {
      type: "popup",
      class: "btn-primary",
      buttonText: "주소 찾기",
      debug: false,
    };

    expect(options.type).toBe("popup");
    expect(options.class).toBe("btn-primary");
    expect(options.buttonText).toBe("주소 찾기");
  });

  it("should accept valid layer type options", () => {
    const options: DaumAddressOptions = {
      type: "layer",
      target: "addressLayer",
      width: 400,
      height: 500,
      border: 5,
    };

    expect(options.type).toBe("layer");
    expect(options.target).toBe("addressLayer");
    expect(options.width).toBe(400);
    expect(options.height).toBe(500);
    expect(options.border).toBe(5);
  });

  it("should accept valid inline type options", () => {
    const options: DaumAddressOptions = {
      type: "inline",
      target: "addressWrap",
    };

    expect(options.type).toBe("inline");
    expect(options.target).toBe("addressWrap");
  });

  it("should accept array of CSS classes", () => {
    const options: DaumAddressOptions = {
      class: ["btn", "btn-primary", "btn-lg"],
    };

    expect(Array.isArray(options.class)).toBe(true);
    expect(options.class).toHaveLength(3);
  });
});
