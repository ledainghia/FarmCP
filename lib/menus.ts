export type SubChildren = {
  href: string;
  label: string;
  active: boolean;
  children?: SubChildren[];
};
export type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus?: Submenu[];
  children?: SubChildren[];
};

export type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: any;
  submenus: Submenu[];
  id: string;
};

export type Group = {
  groupLabel: string;
  menus: Menu[];
  id: string;
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: 'dashboard',
      id: 'dashboard',
      menus: [
        {
          id: 'dashboard',
          href: '/dashboard/analytics',
          label: 'dashboard',
          active: pathname.includes('/dashboard'),
          icon: 'heroicons-outline:home',
          submenus: [
            {
              href: '/dashboard/analytics',
              label: 'analytics',
              active: pathname === '/dashboard/analytics',
              icon: 'heroicons:arrow-trending-up',
              children: [],
            },
          ],
        },
      ],
    },
    {
      groupLabel: 'Bác sĩ thú y',
      id: 'bac_si_thu_y',
      menus: [
        {
          id: 'benh_tat',
          href: '/app/bac_si/benh_tat',
          label: 'Báo cáo bệnh tật',
          active: pathname.includes('/app/bac_si/benh_tat'),
          icon: 'map:veterinary-care',
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Quản lí',
      id: 'management',
      menus: [
        {
          id: 'todo',
          href: '/app/todo',
          label: 'Công việc nông trại',
          active: pathname.includes('/app/todo'),
          icon: 'heroicons-outline:clipboard-check',
          submenus: [],
        },

        {
          id: 'templates',
          href: '/app/templates',
          label: 'Mẫu',
          active: pathname.includes('/app/templates'),
          icon: 'heroicons:document',
          submenus: [],
        },
        // {
        //   id: 'farmingBatch',
        //   href: '/app/vu_nuoi',
        //   label: 'Vụ nuôi',
        //   active: pathname.includes('/app/vu_nuoi'),
        //   icon: 'fluent:arrow-clockwise-dashes-settings-32-filled',
        //   submenus: [],
        // },

        // {
        //   id: 'todo',
        //   href: '/app/todo',
        //   label: 'Con vật',
        //   active: pathname.includes('/app/1'),
        //   icon: 'fluent:animal-paw-print-20-regular',
        //   submenus: [],
        // },
        {
          id: 'todo',
          href: '/app/todo',
          label: 'kho',
          active: pathname.includes('/app/2'),
          icon: 'mdi:farm-home-outline',
          submenus: [],
        },

        {
          id: 'todo',
          href: '/app/vacines',
          label: 'Vác-xin',
          active: pathname.includes('/app/vacines'),
          icon: 'material-symbols-light:vaccines-outline',
          submenus: [],
        },
        {
          id: 'todo',
          href: '/app/barn',
          label: 'chuồng trại',
          active: pathname.includes('/app/barn'),
          icon: 'ph:barn',
          submenus: [],
        },

        {
          id: 'control_device',
          href: '/app/control_device',
          label: 'Thiết bị điều khiển',
          active: pathname.includes('/app/control_device'),
          icon: 'ant-design:control-outlined',
          submenus: [],
        },
        {
          id: 'sensors',
          href: '/app/sensors',
          label: 'Cảm biến',
          active: pathname.includes('/app/sensors'),
          icon: 'tabler:photo-sensor-3',
          submenus: [],
        },
        {
          id: 'users',
          href: '/app/users',
          label: 'Người dùng',
          active: pathname.includes('/app/users'),
          icon: 'solar:user-linear',
          submenus: [],
        },
      ],
    },

    {
      groupLabel: 'Báo cáo',
      id: 'report',
      menus: [
        {
          id: 'totalReport',
          href: '/app/report/total',
          label: 'Báo cáo tổng hợp',
          active: pathname.includes('/app/report/total'),
          icon: 'fluent-mdl2:report-document',
          submenus: [],
        },
      ],
    },
  ];
}
export function getHorizontalMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: 'dashboard',
      id: 'dashboard',
      menus: [
        {
          id: 'dashboard',
          href: '/dashboard/analytics',
          label: 'dashboard',
          active: pathname.includes('/dashboard'),
          icon: 'heroicons-outline:home',
          submenus: [
            {
              href: '/dashboard/analytics',
              label: 'analytics',
              active: pathname === '/dashboard/analytics',
              icon: 'heroicons:arrow-trending-up',
              children: [],
            },
            {
              href: '/dashboard/dash-ecom',
              label: 'ecommerce',
              active: pathname === '/dashboard/dash-ecom',
              icon: 'heroicons:shopping-cart',
              children: [],
            },
            {
              href: '/dashboard/project',
              label: 'project',
              active: pathname === '/dashboard/project',
              icon: 'heroicons:document',
              children: [],
            },
            {
              href: '/dashboard/crm',
              label: 'crm',
              active: pathname === '/dashboard/crm',
              icon: 'heroicons:share',
              children: [],
            },
            {
              href: '/dashboard/banking',
              label: 'banking',
              active: pathname === '/dashboard/banking',
              icon: 'heroicons:credit-card',
              children: [],
            },
          ],
        },
      ],
    },

    {
      groupLabel: 'apps',
      id: 'app',
      menus: [
        {
          id: 'app',
          href: '/app/chat',
          label: 'apps',
          active: pathname.includes('/app/chat'),
          icon: 'heroicons-outline:chat',
          submenus: [
            {
              href: '/app/chat',
              label: 'chat',
              active: pathname === '/app/chat',
              icon: 'heroicons-outline:chat',
              children: [],
            },
            {
              href: '/app/email',
              label: 'email',
              active: pathname === '/app/email',
              icon: 'heroicons-outline:mail',
              children: [],
            },
            {
              href: '/app/kanban',
              label: 'kanban',
              active: pathname === '/app/kanban',
              icon: 'heroicons-outline:view-boards',
              children: [],
            },
            {
              href: '/app/calendar',
              label: 'calendar',
              active: pathname === '/app/calendar',
              icon: 'heroicons-outline:calendar',
              children: [],
            },
            {
              href: '/app/todo',
              label: 'todo',
              active: pathname === '/app/todo',
              icon: 'heroicons-outline:clipboard-check',
              children: [],
            },
            {
              href: '/app/projects',
              label: 'projects',
              active: pathname === '/app/projects',
              icon: 'heroicons-outline:document',
              children: [],
            },
          ],
        },
      ],
    },
    {
      groupLabel: 'ecommerce',
      id: 'ecommerce',
      menus: [
        {
          id: 'ecommerce',
          href: '/ecommerce/frontend',
          label: 'ecommerce',
          active: pathname.includes('/ecommerce'),
          icon: 'heroicons-outline:shopping-bag',
          submenus: [
            {
              href: '/ecommerce/frontend',
              label: 'userApp',
              active: pathname === '/ecommerce/frontend',
              icon: 'heroicons-outline:user',
              children: [
                {
                  href: '/ecommerce/frontend',
                  label: 'products',
                  active: pathname === '/ecommerce/frontend',
                },
                {
                  href: '/ecommerce/frontend/c06d48bf-7f35-4789-b71e-d80fee5b430t',
                  label: 'productDetails',
                  active:
                    pathname ===
                    '/ecommerce/frontend/c06d48bf-7f35-4789-b71e-d80fee5b430t',
                },
                {
                  href: '/ecommerce/frontend/checkout/cart',
                  label: 'cart',
                  active: pathname === '/ecommerce/frontend/checkout/cart',
                },
                {
                  href: '/ecommerce/frontend/wishlist',
                  label: 'wishlist',
                  active: pathname === '/ecommerce/frontend/wishlist',
                },
              ],
            },
            {
              href: '/ecommerce/backend',
              label: 'adminApp',
              active: pathname === '/ecommerce/backend',
              icon: 'heroicons-outline:user-circle',
              children: [
                {
                  href: '/ecommerce/backend/add-product',
                  label: 'addProduct',
                  active: pathname === '/ecommerce/backend/add-product',
                },
                {
                  href: '/ecommerce/backend/customer-list',
                  label: 'customerList',
                  active: pathname === '/ecommerce/backend/customer-list',
                },
                {
                  href: '/ecommerce/backend/edit-product',
                  label: 'editProduct',
                  active: pathname === '/ecommerce/backend/edit-product',
                },
                {
                  href: '/ecommerce/backend/invoice',
                  label: 'invoice',
                  active: pathname === '/ecommerce/backend/invoice',
                },
                {
                  href: '/ecommerce/backend/order-details',
                  label: 'orderDetails',
                  active: pathname === '/ecommerce/backend/order-details',
                },
                {
                  href: '/ecommerce/backend/order-list',
                  label: 'orderList',
                  active: pathname === '/ecommerce/backend/order-list',
                },
                {
                  href: '/ecommerce/backend/purchase-list',
                  label: 'purchaseList',
                  active: pathname === '/ecommerce/backend/purchase-list',
                },
                {
                  href: '/ecommerce/backend/sellers',
                  label: 'sellers',
                  active: pathname === '/ecommerce/backend/sellers',
                },
              ],
            },
          ],
        },
      ],
    },
    {
      groupLabel: 'pages',
      id: 'auth',
      menus: [
        {
          id: 'auth',
          href: '/auth/login',
          label: 'authentication',
          active: pathname.includes('/auth'),
          icon: 'heroicons-outline:lock-closed',
          submenus: [
            {
              href: '/auth/login',
              label: 'signInOne',
              active: pathname === '/auth/login',
              icon: '',
              children: [],
            },
            {
              href: '/auth/login2',
              label: 'signInTwo',
              active: pathname === '/auth/login2',
              icon: '',
              children: [],
            },
            {
              href: '/auth/login3',
              label: 'signInThree',
              active: pathname === '/auth/login3',
              icon: '',
              children: [],
            },
            {
              href: '/auth/register',
              label: 'signUpOne',
              active: pathname === '/auth/register',
              icon: '',
              children: [],
            },
            {
              href: '/auth/register2',
              label: 'signUpTwo',
              active: pathname === '/auth/register2',
              icon: '',
              children: [],
            },
            {
              href: '/auth/register3',
              label: 'signUpThree',
              active: pathname === '/auth/register3',
              icon: '',
              children: [],
            },
            {
              href: '/auth/forgot-password',
              label: 'forgotPasswordOne',
              active: pathname === '/auth/forgot-password',
              icon: '',
              children: [],
            },
            {
              href: '/auth/forgot-password2',
              label: 'forgotPasswordTwo',
              active: pathname === '/auth/forgot-password2',
              icon: '',
              children: [],
            },
            {
              href: '/auth/forgot-password3',
              label: 'forgotPasswordThree',
              active: pathname === '/auth/forgot-password3',
              icon: '',
              children: [],
            },
            {
              href: '/auth/look-screen',
              label: 'lockScreenOne',
              active: pathname === '/auth/look-screen',
              icon: '',
              children: [],
            },
            {
              href: '/auth/look-screen',
              label: 'lockScreenTwo',
              active: pathname === '/auth/look-screen2',
              icon: '',
              children: [],
            },
            {
              href: '/auth/look-screen3',
              label: 'lockScreenThree',
              active: pathname === '/auth/look-screen3',
              icon: '',
              children: [],
            },
          ],
        },
      ],
    },
    {
      groupLabel: '',
      id: 'utility',
      menus: [
        {
          id: 'utility',
          href: '/utility/blank-page',
          label: 'utility',
          active: pathname.includes('/utility'),
          icon: 'heroicons-outline:view-boards',
          submenus: [
            {
              href: '/utility/blank-page',
              label: 'blankPage',
              active: pathname === '/utility/blank-page',
              icon: 'heroicons:document',
              children: [],
            },
            {
              href: '/utility/blog',
              label: 'blog',
              active: pathname === '/utility/blog',
              icon: 'heroicons:square-2-stack',
              children: [],
            },
            {
              href: '/utility/faq',
              label: 'faq',
              active: pathname === '/utility/faq',
              icon: 'heroicons:question-mark-circle',
              children: [],
            },
            {
              href: '/utility/invoice',
              label: 'invoice',
              active: pathname === '/utility/invoice',
              icon: 'heroicons:clipboard-document-list',
              children: [],
            },
            {
              href: '/utility/pricing',
              label: 'pricing',
              active: pathname === '/utility/pricing',
              icon: 'heroicons:currency-dollar',
              children: [],
            },
            {
              href: '/utility/profile',
              label: 'profile',
              active: pathname === '/utility/profile',
              icon: 'heroicons:user-circle',
              children: [],
            },
            {
              href: '/utility/settings',
              label: 'settings',
              active: pathname === '/utility/settings',
              icon: 'heroicons:wrench-screwdriver',
              children: [],
            },
            {
              href: '/changelog',
              label: 'changelog',
              active: pathname.includes('/changelog'),
              icon: 'heroicons:arrow-trending-up',
              children: [],
            },
            {
              href: '/blocks/basic-widget',
              label: 'basicWidget',
              active: pathname === '/blocks/basic-widget',
              icon: 'heroicons-outline:home',
              children: [],
            },
            {
              href: '/blocks/statistic-widget',
              label: 'statisticsWidget',
              active: pathname === '/blocks/statistic-widget',
              icon: 'heroicons-outline:home',
              children: [],
            },
            {
              href: '/icons',
              label: 'icons',
              active: pathname.includes('/icons'),
              icon: 'heroicons-outline:emoji-happy',
              children: [],
            },
          ],
        },
      ],
    },

    {
      groupLabel: '',
      id: 'icons',
      menus: [],
    },
  ];
}
