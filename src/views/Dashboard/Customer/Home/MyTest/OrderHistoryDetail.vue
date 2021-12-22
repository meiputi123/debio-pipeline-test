<template lang="pug">
  .customer-orderHistoryDetail
    div.body
      ui-debio-card(
        width="100%"
        height="1000px"
      )
        div.headerSection
          span Test Summary
        div.bodyContent
          v-row
            v-col
              div.leftSection.box.fillColor
                div.topRow
                  div.topHead
                    span Lab Details
                  div.box
                    div.topBody
                      ui-debio-avatar.dataIcon.box(
                        v-if="!!myTest.labInfo.profileImage"
                        :src="myTest.labInfo.profileImage"
                        :size="92"
                      )
                      ui-debio-icon.dataIcon.box(
                        v-else
                        :icon="microscopeIcon"
                        :size="92"
                        stroke
                        :stroke-width="0"
                        color="linear-gradient(180deg, #716CFF 0%, #B267FF 100%)"
                        view-box="0 0 47 52"
                      )
                      div.topContentWraper
                        span {{ myTest.labInfo.name }}
                        span {{ myTest.labInfo.address }}
                div.middleRow
                  div.topHead
                    span Product Details
                  div.box
                    div.topBody
                      ui-debio-avatar.dataIcon.box(
                        v-if="!!myTest.serviceInfo.image"
                        :src="myTest.serviceInfo.image"
                        :size="92"
                      )
                      ui-debio-icon.dataIcon.box(
                        v-else
                        :icon="selectedIcon"
                        :size="92"
                        stroke
                        :stroke-width="0"
                        color="linear-gradient(180deg, #716CFF 0%, #B267FF 100%)"
                        :view-box="selectedIcon == dnaIcon? '0 0 32 40' : '0 0 55 55'"
                      )
                      div.topContentWraper
                        span {{ myTest.serviceInfo.name }}
                        span {{ myTest.serviceInfo.description }}
                div.bottomRow
                  span Specimen Number
                  span {{ myTest.dnaSampleTrackingId }}
            v-col
              div.rightSection.box
                div
                  div.imageBanner.box
                    ui-debio-icon(
                      :icon="banner"
                      :size="status['size']"
                      :view-box="status['viewBox']"
                    )
                div.statusSection
                  span.status {{ status['name'] }}
                  span.detail {{ setDetail }}

                .progress
                  .step-indicator
                    .step
                      div(:class="[`step-icon`, e1>1 && `active`]")
                        v-icon(v-if="e1>1").icon mdi-check
                      small Registered
                    .indicator-line
                    .step
                      div(:class="[`step-icon`, e1>2 && `active`]")
                        v-icon(v-if="e1>2").icon mdi-check
                      small Received
                    .indicator-line
                    .step
                      div(:class="[`step-icon`, e1>3 && `active`, isRejected()]")
                        v-icon(v-if="e1>3 && myTest.status === `Rejected`").icon mdi-close
                        v-icon(v-else-if="e1>3").icon mdi-check
                      small Quality Control
                    div(:class="[`indicator-line`, isRejected()]")
                    .step
                      div(:class="[`step-icon`, e1>4 && `active`, isRejected(true)]")
                        v-icon(v-if="e1>4").icon mdi-check
                      small Analyzed
                    div(:class="[`indicator-line`, isRejected()]")
                    .step
                      div(:class="[`step-icon`, e1>5 && `active`, isRejected(true)]")
                        v-icon(v-if="e1>5").icon mdi-check
                      small Results Ready

                .button
                  v-btn(
                    v-if="myTest.status === `Rejected`"
                    @click="showDetail = true"
                    color="primary"
                    large
                    width="100%"
                  ) View Details
                  v-btn(
                    v-else
                    @click="toViewResult"
                    color="secondary"
                    large
                    width="100%"
                    :disabled="myTest.status !== `ResultReady`"
                  ) View Result

                ui-debio-modal(
                  title="Quality Control Issues"
                  @onClose="showDetail = false"
                  :ctaAction="closeModal"
                  :show="showDetail"
                  :show-title="true"
                  :show-cta="true"
                  ctaTitle="OK"
                )
                  .content
                    p {{ myTest.rejectedTitle || 'Title'}}
                    p {{ myTest.rejectedDescription || 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'}}
                  .content-detail
                    .border-bottom.ph15
                      p Details:
                    .border-bottom.mt10.ph15
                      .flex
                        p Service Price
                        p {{ myTest.serviceInfo.pricesByCurrency[0].priceComponents[0].value }} {{ myTest.serviceInfo.pricesByCurrency[0].currency.toUpperCase() }}
                      .flex
                        p Quality Control Price
                        p {{ myTest.serviceInfo.pricesByCurrency[0].additionalPrices[0].value }} {{ myTest.serviceInfo.pricesByCurrency[0].currency.toUpperCase() }}
                    .mt10.ph15.flex
                      p Amount to refund
                      p {{ myTest.serviceInfo.pricesByCurrency[0].priceComponents[0].value - myTest.serviceInfo.pricesByCurrency[0].additionalPrices[0].value }} {{ myTest.serviceInfo.pricesByCurrency[0].currency.toUpperCase() }}
</template>

<script>
import {
  microscopeIcon,
  weightLifterIcon,
  fileSearchIcon,
  hairIcon,
  familyTreeIcon,
  dnaIcon,
  foodAppleIcon,
  pillIcon,
  virusIcon,
  registeredBanner, //"0 0 182 135" size 185
  receivedBanner, //"-20 0 300 135" size 300
  wetworkBanner, //"-20 0 300 150" size 295
  resultReadyBanner, //"-20 0 300 150" size 295
  qualityControlBanner, //"-20 0 300 125" size 295
  rejectedQCBanner
} from "@/common/icons";
export default {
  name: "OrderHistoryDetail",
  data: () => ({
    microscopeIcon,
    fileSearchIcon,
    hairIcon,
    familyTreeIcon,
    dnaIcon,
    foodAppleIcon,
    pillIcon,
    virusIcon,
    weightLifterIcon,
    registeredBanner,
    receivedBanner,
    wetworkBanner,
    resultReadyBanner,
    qualityControlBanner,
    rejectedQCBanner,
    link: "https://www.degenics.com/",
    DnaSampleStatus: "Registered",
    banner: registeredBanner,
    selectedIcon: weightLifterIcon,
    showDetail: false,
    e1: 1,
    status: {
      status: "",
      name: "",
      detail:"",
      size: 0,
      viewBox: ""
    },
    myTest: {},
    orderDetail: [
      {
        status: "Registered",
        name: "Registered",
        detail:
          "Your request has been registered. You may send your sample to selected lab.",
        size: 185,
        viewBox: "-10 -13 182 182"
      },
      {
        status: "Received",
        name: "Received",
        detail: "Your chosen lab has received and confirmed your specimen. The lab will soon process your order.",
        size: 300,
        viewBox: "-18 -20 295 295"
      },
      {
        status: "QualityControlled",
        name: "Quality Control",
        detail: "Your specimen is now being examined by the lab to see if it is sufficient enough to be analyzed in the next phase. The lab will perform several procedures such as examine the visual of your specimen, do extraction and amplification of your DNA.",
        size: 295,
        viewBox: "-18 -15 275 275"
      },
      {
        status: "WetWork",
        name: "Wet Work",
        detail: "The lab is now analyzing your specimen.",
        size: 295,
        viewBox: "-15 -5 285 285"
      },
      {
        status: "ResultReady",
        name: "Result Ready",
        detail: "Thank you for your patience. Your order has been fulfilled. You can click on this button below to see your result.",
        size: 295,
        viewBox: "-5 -5 295 295"
      },
      {
        status: "Rejected",
        name: "Quality Control",
        detail: `Your sample has failed quality control. Your service fee of XX DAI will be refunded to your account.`,
        size: 295,
        viewBox: "-15 -5 260 260"
      }
    ]
  }),
  mounted() {
    this.myTest = this.$route.params
    this.checkOrderDetail()
    this.iconSwitcher()
  },
  computed: {
    setDetail() {
      const detail = `Your sample has failed quality control. Your service fee of ${this.myTest.serviceInfo.pricesByCurrency[0].priceComponents[0].value - this.myTest.serviceInfo.pricesByCurrency[0].additionalPrices[0].value} ${this.myTest.serviceInfo.pricesByCurrency[0].currency} will be refunded to your account.`
      if (this.status.status === "Rejected") return detail
      return this.status.detail
    }
  },
  methods: {
    handleAction() {
      window.open(this.link, "_blank")
    },
  
    toViewResult() {
      this.$router.push({ name: "test-result", params: {idOrder: this.myTest.orderId}})
    },

    isRejected(border) {
      if (border) return this.myTest.status === "Rejected" && `border-error`
      else return  this.myTest.status === "Rejected" && `error`
    },

    closeModal() {
      this.showDetail = false
    },

    iconSwitcher() {
      switch (this.myTest.serviceInfo.name) {
      case "Covid-19 Testing":
        this.selectedIcon = virusIcon;
        break;
      case "Whole Genome Sequencing":
        this.selectedIcon = dnaIcon;
        break;
      case "Diet":
        this.selectedIcon = weightLifterIcon;
        break;
      case "Skin":
        this.selectedIcon = hairIcon;
        break;
      case "SNP Microarray":
        this.selectedIcon = dnaIcon;
        break;
      default:
        this.selectedIcon = weightLifterIcon;
        break;
      }
    },
    
    checkOrderDetail() {
      switch (this.myTest.status) {
      case "Registered":
        this.banner = registeredBanner;
        this.status = this.orderDetail[0]
        this.e1 = 2
        break;
      case "Received":
        this.status = this.orderDetail[1]
        this.banner = receivedBanner;
        this.e1 = 3
        break;
      case "QualityControlled":
        this.status = this.orderDetail[2]
        this.banner = qualityControlBanner;
        this.e1 = 4
        break;
      case "WetWork":
        this.status = this.orderDetail[3]
        this.banner = wetworkBanner;
        this.e1 = 5
        break;
      case "ResultReady":
        this.status = this.orderDetail[4]
        this.banner = resultReadyBanner;
        this.e1 = 6
        break;
      case "Rejected":
        this.status = this.orderDetail[5]
        this.banner = rejectedQCBanner;
        this.e1 = 4
        break;
      default:
        this.status = {};
        this.banner = "";
        this.e1 = 1
        break;
      }
    }
  }
  // beforeMount() {
  //   if (!Object.keys(this.$route.params).length)
  //     this.$router.push({ name: "my-test" });
  // } //temporary disable
};
</script>

<style lang="sass">
.customer-orderHistoryDetail
  margin: 10px
  &::v-deep
    .banner__subtitle
      max-width: 36.188rem !important
  .headerSection
    text-align: center
    margin: 25px 0 50px 0
    font-weight: 600
    font-size: 24px
  .box
    border: solid 0.5px #E4E4E4
    box-sizing: border-box
    margin: 0px
  .fillColor
    height: 456px
  .bodyContent
    margin: 0 0 0 0
  .leftSection
    padding: 17px
    height: 456px
    .topRow
      margin: 0px
    .middleRow
      margin: 25px 0 0 0
    .bottomRow
      display: flex
      margin-top: 21px
      font-weight: 600
      font-size: 14px
      line-height: 20px
      justify-content: space-between
  .rightSection
    padding: 17px
    height: 456px
  .bodyWraper
    padding: 10px
  .dataIcon
    padding: 10px
    margin: 10px
    min-width: 92px
    .dataContent
      margin: 0 0 0 5px
  .topHead
    margin: 0 0 10px 0
    font-weight: 600
    font-size: 20px
    line-height: 32px
  .topBody
    display: flex
  .topContentWraper
    display: flex
    flex-direction: column
    margin: 5px 0 5px 5px
    justify-content: space-evenly
    font-size: 14px
  .imageBanner
    width: 481px
    height:184px
    margin-bottom: 15px
    align-items: center
    display: flex
    flex-direction: column
    background: linear-gradient(81.43deg, #6344D0 2.53%, #9D82FF 100%)

  .statusSection
    display: flex
    flex-direction: column
    .status
      font-size: 14px
      font-weight: 600
      line-height: 20px
      margin: 0 0 10px 0
    .detail
      font-size: 12px
      font-weight: 400
      line-height: 16px
      min-height: 50px
  
  .button
    margin-top: 13px

  .progress
    width: 100%
    min-width: 100px
    padding: 17px
    margin-top: 30px
  .step-indicator
    display: flex
    align-items: center
    .step-icon
      box-sizing: border-box
      display: flex
      align-items: center
      justify-content: center
      width: 20px
      height: 20px
      border: 1px solid #A868FF
      border-radius: 50%
      background: #FFF
      .icon
        font-size: 10px
        color: #ffffff
        font-weight: 500

    .active
      background: linear-gradient(225deg, #D665FF 0%, #4C6FFF 100%)
      border: none
    .error
      background: red
    .border-error
      border: 1px solid red

  .step
    display: flex
    align-items: center
    flex-direction: column
    z-index: 1
    position: relative
    small
      position: absolute
      text-align: center
      font-size: 10px
      top: -30px
      color: #595959
      font-weight: 600
      width: 75px
  .indicator-line
    width: 100%
    height: 1px
    background: #A868FF
    flex: 1

  .content
    background: #F5F7F9
    padding: 20px 15px
    width: 338px
    color: #595959
    font-size: 14px
  
  .content-detail
    text-align: left
    width: 100%
    font-size: 12px
    font-weight: 600
  .flex
    display: flex
    justify-content: space-between
  .border-bottom
    border-bottom: 0.5px solid #D3C9D1
  .ph15
    padding: 0px 15px
  .mt10
    margin-top: 10px
</style>
