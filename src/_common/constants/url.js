const SiteUrl = {
  Dashboard: {
    key: "dashboard",
    path: "/",
    shortenUrl: "/",
  },
  Contact: {
    key: "contact/dashboard",
    path: "/contact/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      Dashboard: {
        key: "contact/dashboard",
        path: "/contact/dashboard",
        shortenUrl: "/dashboard",
      },
    },
  },
  Structure: {
    key: "structure/dashboard",
    path: "/structure/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      list: {
        key: "structure/list",
        path: "/structure/list",
        shortenUrl: "/list",
      },
      top: {
        key: "structure/top",
        path: "/structure/top",
        shortenUrl: "/top",
      },
    },
  },
  Money: {
    key: "money/dashboard",
    path: "/money/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      Pay: {
        key: "money/pay",
        path: "/money/pay",
        shortenUrl: "/pay",
      },
      Receive: {
        key: "money/receive",
        path: "/money/receive",
        shortenUrl: "/receive",
      },
      ReceiveDetail: {
        key: "money/receive/:id",
        path: "/money/receive/:id",
        shortenUrl: "/receive/:id",
      },
      Inventory: {
        key: "money/inventory",
        path: "/money/inventory",
        shortenUrl: "/inventory",
      },
      Report: {
        key: "money/report",
        path: "/money/report",
        shortenUrl: "/report",
      },
    },
  },
  Bank: {
    key: "bank/dashboard",
    path: "/bank/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      Pay: {
        key: "bank/expenditure",
        path: "/bank/expenditure",
        shortenUrl: "/expenditure",
      },
      Receive: {
        key: "bank/revenue",
        path: "/bank/revenue",
        shortenUrl: "/revenue",
      },
      Inventory: {
        key: "bank/inventory",
        path: "/bank/inventory",
        shortenUrl: "/inventory",
      },
      Report: {
        key: "bank/report",
        path: "/bank/report",
        shortenUrl: "/report",
      },
    },
  },
  PurchaseRequest: {
    key: "purchase-request/dashboard",
    path: "/purchase-request/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      create: {
        key: "purchase-request/create",
        path: "/purchase-request/create",
        shortenUrl: "/create",
      },
      update: {
        key: "purchase-request/update",
        path: "/purchase-request/update",
        shortenUrl: "/update",
      },
    },
  },
  PurchaseOrder: {
    key: "purchase-order/dashboard",
    path: "/purchase-order/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      create: {
        key: "purchase-order/create",
        path: "/purchase-order/create",
        shortenUrl: "/create",
      },
      update: {
        key: "purchase-order/update",
        path: "/purchase-order/update",
        shortenUrl: "/update",
      },
    },
  },
  SalePOS: {
    key: "sale-pos/dashboard",
    path: "/sale-pos/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      pos: {
        key: "pos",
        path: "/pos",
        shortenUrl: "/pos",
      },
      create: {
        key: "sale-pos/create",
        path: "/sale-pos/create",
        shortenUrl: "/create",
      },
      update: {
        key: "sale-pos/update",
        path: "/sale-pos/update",
        shortenUrl: "/update",
      },
    },
  },
  SaleOrder: {
    key: "sale-order/dashboard",
    path: "/sale-order/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      create: {
        key: "sale-order/create",
        path: "/sale-order/create",
        shortenUrl: "/create",
      },
      update: {
        key: "sale-order/update",
        path: "/sale-order/update",
        shortenUrl: "/update",
      },
    },
  },
  Payment: {
    key: "payment/dashboard",
    path: "/payment/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      personal: {
        key: "payment/personal",
        path: "/payment/personal",
        shortenUrl: "/personal",
      },
      profit: {
        key: "payment/profit",
        path: "/payment/profit",
        shortenUrl: "/profit",
      },
      gift: {
        key: "payment/gift",
        path: "/payment/gift",
        shortenUrl: "/gift",
      },
      create: {
        key: "payment/create",
        path: "/payment/create",
        shortenUrl: "/create",
      },
      update: {
        key: "payment/update",
        path: "/payment/update",
        shortenUrl: "/update",
      },
    },
  },
  PriceQuote: {
    key: "price-quote/dashboard",
    path: "/price-quote/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      create: {
        key: "price-quote/create",
        path: "/price-quote/create",
        shortenUrl: "/create",
      },
      update: {
        key: "price-quote/update",
        path: "/price-quote/update",
        shortenUrl: "/update",
      },
    },
  },
  Product: {
    key: "product/dashboard",
    path: "/product/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      list: {
        key: "product/list",
        path: "/product/list",
        shortenUrl: "/list",
      },
      create: {
        key: "product/create",
        path: "/product/create",
        shortenUrl: "/create",
      },
      update: {
        key: "product/update",
        path: "/product/update",
        shortenUrl: "/update",
      },
      category: {
        key: "product/category",
        path: "/product/category",
        shortenUrl: "/category",
      },
      branch: {
        key: "product/branch",
        path: "/product/branch",
        shortenUrl: "/branch",
      },
      unit: {
        key: "product/unit",
        path: "/product/unit",
        shortenUrl: "/unit",
      },
      group: {
        key: "product/group",
        path: "/product/group",
        shortenUrl: "/group",
      },
    },
  },
  User: {
    key: "user/dashboard",
    path: "user/dashboard",
    shortenUrl: "dashboard",
    Child: {
      list: {
        key: "user/list",
        path: "/user/list",
        shortenUrl: "/list",
      },
      create: {
        key: "user/create",
        path: "/user/create",
        shortenUrl: "/create",
      },
      update: {
        key: "user/update",
        path: "user/update",
        shortenUrl: "/update",
      },
      permission: {
        key: "user/permission",
        path: "/user/permission",
        shortenUrl: "/permission",
      },
      role: {
        key: "user/role",
        path: "/user/role",
        shortenUrl: "/role",
      },
      transfer: {
        key: "user/transfer",
        path: "/user/transfer",
        shortenUrl: "/transfer",
      },
    },
  },
  Supplier: {
    key: "supplier/dashboard",
    path: "/supplier/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      list: {
        key: "supplier/list",
        path: "/supplier/list",
        shortenUrl: "/list",
      },
      create: {
        key: "supplier/create",
        path: "/supplier/create",
        shortenUrl: "/create",
      },
      update: {
        key: "supplier/update",
        path: "/supplier/update",
        shortenUrl: "/update",
      },
    },
  },
  Customer: {
    key: "customer/dashboard",
    path: "/customer/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      list: {
        key: "customer/list",
        path: "/customer/list",
        shortenUrl: "/list",
      },
      create: {
        key: "customer/create",
        path: "/customer/create",
        shortenUrl: "/create",
      },
      update: {
        key: "customer/update",
        path: "/customer/update",
        shortenUrl: "/update",
      },
    },
  },
  Category: {
    key: "category/dashboard",
    path: "/category/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      product: {
        key: "category/product",
        path: "/category/product",
        shortenUrl: "/product",
      },
      news: {
        key: "category/news",
        path: "/category/news",
        shortenUrl: "/news",
      },
      help: {
        key: "category/help",
        path: "/category/help",
        shortenUrl: "/help",
      },
    },
  },
  Brand: {
    key: "brand/dashboard",
    path: "/brand/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      list: {
        key: "brand/list",
        path: "/brand/list",
        shortenUrl: "/list",
      },
    },
  },
  Level: {
    key: "level/dashboard",
    path: "/level/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      list: {
        key: "level/list",
        path: "/level/list",
        shortenUrl: "/list",
      },
    },
  },
  ProductVariation: {
    key: "product-variation/dashboard",
    path: "/product-variation/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      list: {
        key: "product-variation/list",
        path: "/product-variation/list",
        shortenUrl: "/list",
      },
    },
  },
  Token: {
    key: "token/dashboard",
    path: "/token/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      list: {
        key: "token/list",
        path: "/token/list",
        shortenUrl: "/list",
      },
    },
  },
  Unit: {
    key: "unit/dashboard",
    path: "/unit/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      list: {
        key: "unit/list",
        path: "/unit/list",
        shortenUrl: "/list",
      },
    },
  },
  Warranty: {
    key: "warranty/dashboard",
    path: "/warranty/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      list: {
        key: "warranty/list",
        path: "/warranty/list",
        shortenUrl: "/list",
      },
      history: {
        key: "warranty/history",
        path: "/warranty/history",
        shortenUrl: "/history",
      },
    },
  },
  Transport: {
    key: "transport/dashboard",
    path: "/transport/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      Project: {
        key: "transport/project",
        path: "/transport/project",
        shortenUrl: "/project",
      },
      DeliverySell: {
        key: "transport/delivery-sell",
        path: "/transport/delivery-sell",
        shortenUrl: "/delivery-sell",
      },
      DeliveryPurchase: {
        key: "transport/delivery-purchase",
        path: "/transport/delivery-purchase",
        shortenUrl: "/delivery-purchase",
      },
    },
  },
  Stock: {
    key: "stock/dashboard",
    path: "/stock/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      list: {
        key: "stock/list",
        path: "/stock/list",
        shortenUrl: "/list",
      },
      import: {
        key: "stock/import",
        path: "/stock/import",
        shortenUrl: "/import",
      },
      importConfirm: {
        key: "stock/import-confirm",
        path: "/stock/import-confirm",
        shortenUrl: "/import-confirm",
      },
      export: {
        key: "stock/export",
        path: "/stock/export",
        shortenUrl: "/export",
      },
      exportConfirm: {
        key: "stock/export-confirm",
        path: "/stock/export-confirm",
        shortenUrl: "/export-confirm",
      },
      report: {
        key: "stock/report",
        path: "/stock/report",
        shortenUrl: "/report",
      },
      purchaseRequest: {
        key: "stock/purchase-request",
        path: "/stock/purchase-request",
        shortenUrl: "/purchase-request",
      },
    },
  },
  Setting: {
    key: "setting/dashboard",
    path: "/setting/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      config: {
        key: "setting/config",
        path: "/setting/config",
        shortenUrl: "/config",
      },
      permission: {
        key: "setting/permission",
        path: "/setting/permission",
        shortenUrl: "/permission",
      },
      role: {
        key: "setting/role",
        path: "/setting/role",
        shortenUrl: "/role",
      },
      menu: {
        key: "setting/menu",
        path: "/setting/menu",
        shortenUrl: "/menu",
      },
      pageList: {
        key: "setting/page-list",
        path: "/setting/page-list",
        shortenUrl: "/page-list",
      },
      pageCreate: {
        key: "setting/page-create",
        path: "/setting/page-create",
        shortenUrl: "/page-create",
      },
      pageUpdate: {
        key: "setting/page-update",
        path: "/setting/page-update",
        shortenUrl: "/page-update",
      },
    },
  },
  News: {
    key: "news/dashboard",
    path: "/news/dashboard",
    shortenUrl: "/dashboard",
    Child: {
      list: {
        key: "news/list",
        path: "/news/list",
        shortenUrl: "/list",
      },
      create: {
        key: "news/create",
        path: "/news/create",
        shortenUrl: "/create",
      },
      update: {
        key: "news/update",
        path: "/news/update",
        shortenUrl: "/update",
      },
    },
  },
};

export default SiteUrl;
