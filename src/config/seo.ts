// SEO 설정 중앙 관리
export const SEO_CONFIG = {
  // 기본 설정 (Greensupia 메인)
  default: {
    title: "Greensupia - 친환경 비닐 제작업체",
    description:
      "Greensupia는 친환경 비닐 제작업체로, 지속가능한 농업을 위한 혁신적인 솔루션을 제공합니다. 환경을 생각하는 농업인의 선택입니다.",
    keywords: [
      "친환경 비닐",
      "농업",
      "지속가능",
      "환경보호",
      "Greensupia",
      "농사용품",
      "친환경 농자재",
      "농업용 비닐",
      "친환경 농업",
      "지속가능한 농업",
    ],
    author: "Greensupia",
    siteName: "Greensupia",
    url: "https://www.greensupia.com",
    image: "/greensupia-og.jpg",
  },

  // 관리자 포털 설정
  portal: {
    title: "관리자 포털 - Greensupia",
    description: "Greensupia 관리자 포털 - 콘텐츠 관리 및 시스템 운영",
    keywords: ["관리자", "포털", "Greensupia", "콘텐츠 관리"],
    author: "Greensupia",
    siteName: "Greensupia 관리자 포털",
    url: "https://www.greensupia.com/portal",
    image: "/portal-og.jpg",
    robots: "noindex, nofollow", // 관리자 페이지는 크롤링 제한
  },

  // 페이지별 설정
  pages: {
    home: {
      title: "홈 - Greensupia",
      description:
        "Greensupia 홈페이지 - 친환경 비닐 제작업체, 지속가능한 농업 솔루션",
      keywords: ["홈", "메인", "친환경 비닐", "농업", "Greensupia"],
    },
    notice: {
      title: "공지사항 - Greensupia",
      description: "Greensupia 공지사항 및 업데이트, 회사 소식",
      keywords: ["공지사항", "업데이트", "소식", "Greensupia", "회사소식"],
    },
    inquiry: {
      title: "문의하기 - Greensupia",
      description: "Greensupia에 문의하기, 고객 문의 및 상담",
      keywords: ["문의", "상담", "고객지원", "Greensupia", "문의하기"],
    },
    inquiryWrite: {
      title: "문의글 작성 - Greensupia",
      description: "Greensupia 문의글 작성, 고객 문의 등록",
      keywords: ["문의글 작성", "문의 등록", "고객문의", "Greensupia"],
    },
    inquiryDetail: {
      title: "문의글 상세 - Greensupia",
      description: "Greensupia 문의글 상세보기, 답변 확인",
      keywords: ["문의글 상세", "답변 확인", "문의내용", "Greensupia"],
      robots: "noindex, nofollow", // 개인정보 보호를 위해 크롤링 제한
    },
    noticeDetail: {
      title: "공지사항 상세 - Greensupia",
      description: "Greensupia 공지사항 상세보기, 회사 소식 확인",
      keywords: ["공지사항 상세", "회사소식", "업데이트", "Greensupia"],
    },
    noticeWrite: {
      title: "공지사항 작성 - Greensupia",
      description: "Greensupia 공지사항 작성, 관리자 전용",
      keywords: ["공지사항 작성", "관리자", "Greensupia"],
      robots: "noindex, nofollow", // 관리자 전용 페이지
    },
  },
};

// 구조화된 데이터 설정
export const STRUCTURED_DATA_CONFIG = {
  organization: {
    greensupia: {
      "@type": "Organization",
      name: "Greensupia",
      url: "https://www.greensupia.com",
      description:
        "Greensupia는 친환경 비닐 제작업체로, 지속가능한 농업을 위한 혁신적인 솔루션을 제공합니다.",
      logo: {
        "@type": "ImageObject",
        url: "https://www.greensupia.com/logo.png",
        width: 200,
        height: 60,
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "테헤란로 123",
        addressLocality: "강남구",
        addressRegion: "서울특별시",
        postalCode: "06123",
        addressCountry: "KR",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+82-2-1234-5678",
        contactType: "customer service",
        email: "info@greensupia.com",
        availableLanguage: "Korean",
      },
      sameAs: [
        "https://www.facebook.com/greensupia",
        "https://www.instagram.com/greensupia",
        "https://www.linkedin.com/company/greensupia",
      ],
      foundingDate: "2020",
      industry: "농업용품 제조업",
      keywords: "친환경 비닐, 농업, 지속가능, 환경보호",
    },
  },
  website: {
    greensupia: {
      "@type": "WebSite",
      name: "Greensupia",
      url: "https://www.greensupia.com",
      description:
        "Greensupia는 친환경 비닐 제작업체로, 지속가능한 농업을 위한 혁신적인 솔루션을 제공합니다.",
      inLanguage: "ko-KR",
      publisher: {
        "@type": "Organization",
        name: "Greensupia",
        logo: {
          "@type": "ImageObject",
          url: "https://www.greensupia.com/logo.png",
        },
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://www.greensupia.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  },
  breadcrumb: {
    greensupia: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "홈",
          item: "https://www.greensupia.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "공지사항",
          item: "https://www.greensupia.com/notice",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "문의하기",
          item: "https://www.greensupia.com/inquiry",
        },
      ],
    },
  },
  article: {
    notice: {
      "@type": "Article",
      headline: "공지사항",
      description: "Greensupia 공지사항 및 업데이트",
      author: {
        "@type": "Organization",
        name: "Greensupia",
      },
      publisher: {
        "@type": "Organization",
        name: "Greensupia",
        logo: {
          "@type": "ImageObject",
          url: "https://www.greensupia.com/logo.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://www.greensupia.com/notice",
      },
    },
  },
};
