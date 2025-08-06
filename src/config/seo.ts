// SEO 설정 중앙 관리
export const SEO_CONFIG = {
  // 기본 설정
  default: {
    title: "JSEO - 회사 소개",
    description:
      "JSEO는 전문적인 웹 개발 및 디지털 마케팅 서비스를 제공하는 회사입니다.",
    keywords: ["웹개발", "디지털마케팅", "SEO", "웹디자인", "JSEO"],
    author: "JSEO",
    siteName: "JSEO",
    url: "https://jseo.shop",
    image: "/og-image.jpg",
  },

  // Greensupia 설정
  greensupia: {
    title: "Greensupia - 친환경 비닐 제작업체",
    description:
      "Greensupia는 친환경 비닐 제작업체로, 지속가능한 농업을 위한 혁신적인 솔루션을 제공합니다.",
    keywords: [
      "친환경 비닐",
      "농업",
      "지속가능",
      "환경보호",
      "Greensupia",
      "농사용품",
    ],
    author: "Greensupia",
    siteName: "Greensupia",
    url: "https://jseo.shop/greensupia",
    image: "/greensupia-og.jpg",
  },

  // 관리자 포털 설정
  portal: {
    title: "관리자 포털 - JSEO",
    description: "JSEO 관리자 포털",
    keywords: ["관리자", "포털", "JSEO"],
    author: "JSEO",
    siteName: "JSEO 관리자 포털",
    url: "https://portal.jseo.shop",
    image: "/portal-og.jpg",
    robots: "noindex, nofollow", // 관리자 페이지는 크롤링 제한
  },

  // 페이지별 설정
  pages: {
    home: {
      title: "홈",
      description: "JSEO 홈페이지 - 전문적인 웹 개발 및 디지털 마케팅 서비스",
      keywords: ["홈", "메인", "웹개발", "디지털마케팅"],
    },
    services: {
      title: "서비스",
      description: "JSEO가 제공하는 웹 개발 및 디지털 마케팅 서비스",
      keywords: ["서비스", "웹개발", "디지털마케팅", "SEO", "웹디자인"],
    },
    projects: {
      title: "프로젝트",
      description: "JSEO가 완료한 웹 개발 및 디지털 마케팅 프로젝트",
      keywords: ["프로젝트", "포트폴리오", "웹개발", "디지털마케팅"],
    },
    contact: {
      title: "연락처",
      description: "JSEO 연락처 및 문의 방법",
      keywords: ["연락처", "문의", "고객지원", "JSEO"],
    },
    notice: {
      title: "공지사항",
      description: "JSEO 공지사항 및 업데이트",
      keywords: ["공지사항", "업데이트", "소식", "JSEO"],
    },
  },

  // Greensupia 페이지별 설정
  greensupiaPages: {
    home: {
      title: "홈",
      description: "Greensupia 홈페이지 - 친환경 비닐 제작업체",
      keywords: ["홈", "메인", "친환경 비닐", "농업"],
    },
    contact: {
      title: "연락처",
      description: "Greensupia 연락처 및 문의 방법",
      keywords: ["연락처", "문의", "고객지원", "Greensupia"],
    },
    notice: {
      title: "공지사항",
      description: "Greensupia 공지사항 및 업데이트",
      keywords: ["공지사항", "업데이트", "소식", "Greensupia"],
    },
  },
};

// 구조화된 데이터 설정
export const STRUCTURED_DATA_CONFIG = {
  organization: {
    jseo: {
      name: "JSEO",
      url: "https://jseo.shop",
      description:
        "JSEO는 전문적인 웹 개발 및 디지털 마케팅 서비스를 제공하는 회사입니다.",
      logo: "https://jseo.shop/logo.png",
      contactPoint: {
        telephone: "+82-XXX-XXXX-XXXX",
        contactType: "customer service",
      },
    },
    greensupia: {
      name: "Greensupia",
      url: "https://jseo.shop/greensupia",
      description:
        "Greensupia는 친환경 비닐 제작업체로, 지속가능한 농업을 위한 혁신적인 솔루션을 제공합니다.",
      logo: "https://jseo.shop/greensupia-logo.png",
      address: {
        streetAddress: "테헤란로 123",
        addressLocality: "강남구",
        addressRegion: "서울특별시",
        postalCode: "06123",
        addressCountry: "KR",
      },
      contactPoint: {
        telephone: "+82-2-1234-5678",
        contactType: "customer service",
      },
    },
  },
  website: {
    jseo: {
      name: "JSEO",
      url: "https://jseo.shop",
      description:
        "JSEO는 전문적인 웹 개발 및 디지털 마케팅 서비스를 제공하는 회사입니다.",
    },
    greensupia: {
      name: "Greensupia",
      url: "https://jseo.shop/greensupia",
      description:
        "Greensupia는 친환경 비닐 제작업체로, 지속가능한 농업을 위한 혁신적인 솔루션을 제공합니다.",
    },
  },
};
