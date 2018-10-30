import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/page/home/Index'
import Verifycode  from '@/page/login/Verifycode'
import Password from '@/page/login/Password'
import Update from '@/page/login/Update'
import Register from '@/page/register/Register'
import Apply from '@/page/register/Apply'
import Success from '@/page/register/Success'
import Checkin from '@/page/login/Checkin'
import Info from '@/page/login/Info'
import Remind from '@/page/login/Remind'
import Login from '@/page/assist/Login'
import Detail from '@/page/assist/Detail'
import XlcMap from '@/page/map/Index'
import Bind from '@/page/assist/Bind'
import Timeline from '@/page/patient/Timeline'
import UpLoad from '@/page/patient/UpLoad'
import Move from '@/page/assist/Move'
import Introduce from '@/page/project/Introduce'
import Page from '@/page/project/Page'
import UploadSuccess from "@/page/patient/UploadSuccess";
import Mileage from "@/page/patient/Mileage";
import Noaccess from "@/page/patient/Noaccess";
import Check from "@/page/patient/check";
import CheckPhase from "@/page/patient/CheckPhase";
import Phase from "@/page/patient/phase";
import Question from "@/page/help/Question";
import Answer from "@/page/help/Answer";
import Ask from "@/page/help/Ask";
import Mine from "@/page/help/Mine";
import Query from "@/page/patient/Query";
import Medical from "@/page/patient/Medical";
import CheckSuccess from "@/page/patient/CheckSuccess";
import Knowledge from "@/page/knowledge/Index";
import Shop from "@/page/shop/Index";
import Document from "@/page/document/Index";
import ShopView from "@/page/shop/View";
import ShopOrder from "@/page/shop/Order";
import Old from "@/page/patient/Old";
import Oldline from "@/page/patient/Oldline";
import Exchange from "@/page/shop/Exchange";
import Getmileage from "@/page/knowledge/Getmileage";
import CheckIdentity from "@/page/shop/CheckIdentity";
import KnowledgeHeart from "@/page/knowledge/KnowLedge"
import Empower from "@/page/register/Empower"
import EmRegister from "@/page/register/EmRegister"
import Hwjapply from "@/page/hwj/Hwjapply"
import Hwjempower from "@/page/hwj/Hwjempower"
import Hwjquery from "@/page/hwj/Hwjquery"


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      name: 'index',
      path: '/',
      component: Home,
      meta: {
        title: '首页',
        scrollToTop: true
      },
    },
    //验证码登录
    {
      name: 'login-verifycode',
      path: '/login/verifycode',
      component: Verifycode,
      meta: {
        title: '在线申请',
      },
    },
    //密码登录
    {
      name: 'login-password',
      path: '/login/password',
      component: Password,
      meta: {
        title: '在线申请',
      },
    },
    //修改密码
    {
      name: 'update-password',
      path: '/login/update/:mobile',
      component: Update,
      meta: {
        title: '修改密码',
      },
    },
    //注册
    {
      name: 'register-index',
      path: '/register/register',
      component: Register,
      meta: {
        title: '注册',
      },
    },
    //随访助理注册
    {
      name: 'register-emregister',
      path: '/register/emregister',
      component: EmRegister,
      meta: {
        title: '注册',
      },
    },
    //申请
    {
      name: 'register-apply',
      path: '/register/apply',
      component: Apply,
      meta: {
        title: '预约申请',
      },
    },
    //随访助理申请
    {
      name: 'register-empower',
      path: '/register/empower/:id',
      component: Empower,
      meta: {
        title: '预约申请',
      },
    },
    //申请提交
    {
      name: 'register-success',
      path: '/register/success',
      component: Success,
      meta: {
        title: '申请成功',
      },
    },
    //我要报到
    {
      name: 'login-checkin',
      path: '/login/checkin',
      component: Checkin,
      meta: {
        title: '我要报到',
      },
    },
    //查看信息
    {
      name: 'login-info',
      path: '/login/info',
      component: Info,
      meta: {
        title: '患者信息查看',
      },
    },
    //提示
    {
      name: 'login-remind',
      path: '/login/remind',
      component: Remind,
      meta: {
        title: '提示',
      },
    },
    //助理登录
    {
      name: 'assist-login',
      path: '/assist/login',
      component: Login,
      meta: {
        title: '里程助手申请',
      },
    },
    //患者列表
    {
      name: 'assist-detail',
      path: '/assist/detail',
      component: Detail,
      meta: {
        title: '患者列表',
      },
    },
    //地图
    {
      name: 'xlcmap',
      path: '/map',
      component: XlcMap,
      meta: {
        title: '里程地图',
      },
    },
    //患者绑定
    {
      name: 'assist-bind',
      path: '/assist/bind',
      component: Bind,
      meta: {
        title: '患者绑定',
      },
    },
    //进度查询
    {
      name: 'patient-timeline',
      path: '/patient/timeline/:id',
      component: Timeline,
      meta: {
        title: '进度查询',
      },
    },
    //流程展示
    {
      name: 'patient-phase',
      path: '/patient/phase/:id',
      component: Phase,
      meta: {
        title: '流程状态',
      },
    },
    //随访助理登录页面
    {
      name: 'assist-move',
      path: '/assist/move',
      component: Move,
      meta: {
        title: '里程助手',
      },
    },
    //上传里程
    {
      name: 'patient-upload',
      path: '/patient/upload/:patient_id',
      component: UpLoad,
      meta: {
        title: '上传里程',
      },
    },
    //上传里程成功
    {
      name: 'patient-upload-success',
      path: '/patient/uploadsuccess',
      component: UploadSuccess,
      meta: {
        title: '上传里程',
      },
    },
    //项目
    {
      name: 'project-introduce',
      path: '/project/introduce',
      component: Introduce,
      meta: {
        title: '项目介绍',
      },
    },
    //单文
    {
      name: 'project-page',
      path: '/project/page/:id',
      component: Page,
      meta: {
        title: '详情',
      },
    },
    //上传里程
    {
      name: 'patient-mileage',
      path: '/patient/mileage',
      component: Mileage,
      meta: {
        title: '上传里程',
      },
    },
    //无法上传里程
    {
      name: 'patient-remind',
      path: '/patient/noaccess/:desc',
      component: Noaccess,
      meta: {
        title: '提示',
      },
    },
    //上传成功
    {
      name: 'patient-success',
      path: '/patient/uploadsuccess/:months',
      component: UploadSuccess,
      meta: {
        title: '上传成功',
      },
    },
    //上传审核材料
    {
      name: 'patient-check',
      path: '/patient/check/:patient_id',
      component: Check,
      meta: {
        title: '上传经济审核材料',
      },
    },
    //上传阶段审核材料
    {
      name: 'patient-checkphase',
      path: '/patient/checkphase/:patient_id',
      component: CheckPhase,
      meta: {
        title: '上传阶段审核材料',
      },
    },
    //上传审核材料
    {
      name: 'patient-medical',
      path: '/patient/medical/:patient_id',
      component: Medical,
      meta: {
        title: '上传医学审核材料',
      },
    },
    //申请查询
    {
      name: 'patient-query',
      path: '/patient/query',
      component: Query,
      meta: {
        title: '申请查询',
      },
    },
    //审核材料上传成功
    {
      name: 'patient-checksuccess',
      path: '/patient/checksuccess',
      component: CheckSuccess,
      meta: {
        title: '上传成功',
      },
    },
    //解忧站
    //问题
    {
      name: 'help-question',
      path: '/help/question',
      component: Question,
      meta: {
        title: '精华提问',
      },
    },
    //回答
    {
      name: 'help-answer',
      path: '/help/answer',
      component: Answer,
      meta: {
        title: '精华提问',
      },
    },
    //提问
    {
      name: 'help-ask',
      path: '/help/ask',
      component: Ask,
      meta: {
        title: '精华提问',
      },
    },
    //知识库
    {
      name: 'knowledge',
      path: '/knowledge',
      component: Knowledge,
      meta: {
        title: '知识库',
      },
    },
    //资料下载
    {
      name: 'document',
      path: '/document',
      component: Document,
      meta: {
        title: '资料下载'
      }
    },
    //杂货铺
    {
      name: 'shop',
      path: '/shop',
      component: Shop,
      meta: {
        title: '杂货铺'
      }
    },
    //杂货铺内页
    {
      name: 'shop-view',
      path: '/shop/view/:id',
      component: ShopView,
      meta: {
        title: '礼品兑换'
      }
    },
    //兑换地址
    {
      name: 'shop-exchange',
      path: '/shop/exchange/:gift_id/:patient_id/:num/:price',
      component: Exchange,
      meta: {
        title: '填写地址'
      }
    },
    //杂货铺订单页
    {
      name: 'shop-order',
      path: '/shop/order/:id',
      component: ShopOrder,
      meta: {
        title: '兑换详情'
      }
    },
    //一期申请查询
    {
      name: 'patient-old',
      path: '/patient/old',
      component: Old,
      meta: {
        title: '进度查询'
      }
    },
    //一期申请查询
    {
      name: 'patient-oldline',
      path: '/patient/oldline',
      component: Oldline,
      meta: {
        title: '进度查询'
      }
    },
    //我的问题
    {
      name: 'help-mine',
      path: '/help/mine',
      component:Mine,
      meta: {
        title: '我的问题'
      }
    },
    //里程攻略
    {
      name: 'knowledge-getmileage',
      path: '/knowledge/getmileage',
      component: Getmileage,
      meta: {
        title: '里程攻略'
      }
    },
    //知识库2
    {
      name: 'knowledge-heart',
      path: '/knowledge/knowledgeheart',
      component: KnowledgeHeart,
      meta: {
        title: '知识库'
      }
    },
    //杂货铺验证登录
    {
      name: 'shop-checkidentity',
      path: '/shop/checkidentity',
      component: CheckIdentity,
      meta: {
        title: '杂货铺'
      }
    },
    //红围巾在线申请
    {
      name: 'hwj-apply',
      path: '/hwj/hwjapply',
      component: Hwjapply,
      meta: {
        title: '在线申请'
      }
    },
    //红围巾在线申请
    {
      name: 'hwj-empower',
      path: '/hwj/hwjempower',
      component: Hwjempower,
      meta: {
        title: '辅助申请'
      }
    },
    //红围巾进度查询
    {
      name: 'hwj-query',
      path: '/hwj/hwjquery',
      component: Hwjquery,
      meta: {
        title: '进度申请'
      }
    },
  ]
})
