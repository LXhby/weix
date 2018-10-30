<script>
//   const baseUrl = process.env.NODE_ENV === 'development'
//       ? 'http://wechat.xlc.local'
//       : 'http://xlc.papwx.ilvzhou.com'

// const api = process.env.NODE_ENV === 'development'
//       ? 'http://api.xlc.local/xlc/'
//       : 'http://api.papwx.ilvzhou.com/xlc/'

//   const papApi = process.env.NODE_ENV === 'development'
//       ? 'http://host.local/weixin/xlcmp'
//       : 'http://papbld.ilvzhou.com/weixin/xlcmp'

  const papApi = process.env.NODE_ENV === 'development'
      ? 'http://papv2.local/weixin/xlcmp'
      : 'http://'
  
  const servicePhone = '4001166976'
  const appName = process.env.NODE_ENV === 'development' 
      ? '心里程患者援助项目'
      : '心里程患者援助项目'
  const appDesc = process.env.NODE_ENV === 'development' 
      ? '心里程患者援助项目'
      : '心里程患者援助项目'
      
  const configId = 1
  //注册状态
  const MOBILE_REGISTED = 1;
  const CHECK_IN_WECHAT = 2;
  const NEW_PATIENT = 3;
  //审核材料
  const CATEGORY_ECONOMIC = '入组经济审核';
  const CATEGORY_MEDICAL = '入组医学审核';

export default
{
  configId,
  appName,
  appDesc,
  MOBILE_REGISTED,
  CHECK_IN_WECHAT,
  NEW_PATIENT,
  CATEGORY_ECONOMIC,
  CATEGORY_MEDICAL,
  testFunc: (params)=>{
      console.log(params);
  },
}
</script>