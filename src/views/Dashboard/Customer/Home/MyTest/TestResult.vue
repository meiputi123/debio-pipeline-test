<template lang="pug">
  div
    v-container
      ui-debio-card(width="100%")
        v-row.resultBody
          v-col(cols="12" md="9")
            ui-debio-card(width="100%" height="100%" class="mt-2")
              template
                v-progress-linear(
                  v-if="resultLoading"
                  indeterminate
                  color="primary"
                )
                v-card-text
                  embed(
                    :src="reportResult"
                    type="application/pdf"
                    v-if="isDataPdf"
                    scrolling="auto"
                    height="500px"
                    width="100%"
                  )
                  div
                    span {{dummyResult.title}} 
                    br
                  div
                    span {{dummyResult.subTitle}}
                  div
                    span {{dummyResult.content}}
          v-col(cols="12" md="3")
            div.buttonSection(v-for="(file, index) in files" :key="file.name")
              ui-debio-card(
                :title="file.fileTitle"
                :sub-title="file.fileSubTitle"
                tiny-card
                with-icon
                @click="actionDownload(index)"
              )
                ui-debio-icon(
                  slot="icon"
                  size="33"
                  :icon="downloadIcon"
                  stroke
                  color="#c400a5"
                )

            ui-debio-card(
              v-if="!ratingTestResult"
              class="mt-2"
              tiny-card
              with-icon
              title="Rating"
              sub-title="Help us improve your test experience by rating this service"
              @click="actionRating"
              )
                ui-debio-icon(
                  size="33"
                  slot="icon"
                  :icon="starIcon"
                  stroke
                  color="#c400a5"
                )
            ui-debio-card(
              v-else
              class="mt-2"
              tiny-card
              with-icon
              :title="ratingTitle"
              :sub-title="ratingSubTitle"
              )
                ui-debio-rating(
                  :size="33"
                  :total-rating="ratingTestResult"
                  :with-reviewers="false"
                )

      ui-debio-modal(
        :show="showModalRating"
        :cta-action="submitRating"
        title="Please tell us about your experience!"
        cta-title="Submit"
        @onClose="showModalRating = false"
      )
        template
          ui-debio-rating(
            :size="33"
            :total-rating="5"
            :with-reviewers="false"
            interactive
            @input="getRating"
          )
          ui-debio-text-area(
            :rules="$options.rules.review"
            variant="small"
            label="Write a review"
            placeholder="Write a review"
            v-model="review"
            validate-on-blur
            outlined
            block
          )

      ui-debio-modal(
        :show="showModal"
        :icon="checkCircleIcon"
        :cta-action="closeModal"
        :title="modalTitle"
        cta-title="OK"
        @onClose="showModal = false"
      )

</template>

<script>
import ipfsWorker from "@/common/lib/ipfs/ipfs-worker";
import { downloadDecryptedFromIPFS } from "@/common/lib/ipfs";
import { mapState } from "vuex";
import { queryDnaTestResults } from "@/common/lib/polkadot-provider/query/genetic-testing";
import { queryLabsById } from "@/common/lib/polkadot-provider/query/labs";
import { getOrdersDetail } from "@/common/lib/polkadot-provider/query/orders";
import { queryServicesById } from "@/common/lib/polkadot-provider/query/services";
import { hexToU8a } from "@polkadot/util";
import { submitRatingOrder, getRatingByOrderId } from "@/common/lib/api";
import { downloadIcon, debioIcon, creditCardIcon, starIcon, checkCircleIcon } from "@/common/icons"
import errorMessage from "@/common/constants/error-messages"
import Modal from "@/common/components/Modal";
import Rating from "@/common/components/Rating";
import Textarea from "@/common/components/Textarea";

export default {
  name: "TestResult",

  components: { 
    Modal,
    Rating,
    Textarea
  },

  data: () => ({
    downloadIcon,
    debioIcon,
    creditCardIcon,
    starIcon,
    checkCircleIcon,
    errorMessage,

    privateKey: "",
    publicKey: "",
    idOrder: "",
    ownerAddress: "",
    testResult: {},
    services: [],
    rating: 0,
    review: "",
    ratingTitle: "",
    ratingSubTitle: "",
    ratingTestResult: null,
    lab: null,
    order: null,
    isDataPdf: false,
    serviceName: "",
    serviceCategory: "",
    resultLoading: false,
    showModal: false,
    showModalRating: false,
    files: [],
    fileDownloadIndex: 0,
    baseUrl: "https://ipfs.io/ipfs/",
    dummyResult: {
      title: "Whole Genome Sequencing Test Report",
      subTitle: "GSI Lab, 5 July 2021",
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    }
  }),

  async mounted() {
    this.resultLoading = true;
    this.idOrder = this.$route.params.idOrder;
    this.privateKey = hexToU8a(this.mnemonicData.privateKey);
    this.ownerAddress = this.wallet.address;
    await this.getRatingTestResult();
    await this.getTestResult();
    await this.getLabServices();
    await this.getFileUploaded();
    await this.parseResult();
  },

  methods: {
    async getRatingTestResult() {
      try {
        const data = await getRatingByOrderId(this.idOrder);
        this.ratingTestResult = data.rating;
        this.ratingTitle = `Rating ${this.ratingTestResult},0`;
        this.ratingSubTitle = data.review;
      } catch (error) {
        console.error(error);
      }
    },

    async getTestResult() {
      try {
        this.order = await getOrdersDetail(this.api, this.idOrder);
        this.ownerAddress = this.order.customerEthAddress;
        
        this.testResult = await queryDnaTestResults(
          this.api,
          this.order.dnaSampleTrackingId
        );
      } catch (error) {
        this.resultLoading = false;
        console.error(error);
      }
    },

    async getLabServices() {
      try {
        this.lab = await queryLabsById(this.api, this.testResult.labId);
        this.services = await queryServicesById(this.api, this.order.serviceId);

        this.publicKey = this.lab.info.boxPublicKey;
        this.serviceCategory = this.services.info.category;
        this.serviceName = this.services.info.name;
      } catch (error) {
        this.resultLoading = false;
        this.services = [];
        console.error(error);
      }
    },

    async getFileUploaded() {
      try {
        if (this.testResult.reportLink !== "") {
          this.files.push({
            fileType: "report",
            fileName: this.serviceName + " Report",
            fileLink: this.testResult.reportLink,
            fileTitle: "Download Report",
            fileSubTitle: "Download Your Test Report"
          });
        }

        if (this.testResult.resultLink !== "") {
          this.files.push({
            fileType: "result",
            fileName: this.serviceName + " Result",
            fileLink: this.testResult.resultLink,
            fileTitle: "Download Raw Data",
            fileSubTitle: "Download Your Genomic Data"
          });
        }
      } catch (error) {
        this.resultLoading = false;
        console.error(error);
      }
    },

    async parseResult() {
      try {
        const path = this.files[0].fileLink.replace(this.baseUrl, "");
        const secretKey = this.privateKey;
        const publicKey = this.lab.info.boxPublicKey;
        
        const pair = {
          secretKey,
          publicKey
        };

        const typeFile = "text/plain";
        const channel = new MessageChannel();
        channel.port1.onmessage = ipfsWorker.workerDownload;
        ipfsWorker.workerDownload.postMessage({ path, pair, typeFile }, [
          channel.port2
        ]);

        ipfsWorker.workerDownload.onmessage = (event) => {
          const regexMatchPdf = /^(data:application\/\pdf)/g 
          const isDataPdf = regexMatchPdf.test(event.data);
          this.isDataPdf = isDataPdf;
          
          this.result = event.data;
          this.resultLoading = false;
        };
      } catch (error) {
        this.resultLoading = false;
        console.error(error);
      }
    },

    async actionDownload(index) {
      this.fileDownloadIndex = index;

      try {
        const fileName = this.files[this.fileDownloadIndex].fileName;
        const path = this.files[this.fileDownloadIndex].fileLink.replace(
          this.baseUrl,
          ""
        );

        await downloadDecryptedFromIPFS(
          path, 
          this.privateKey, 
          this.publicKey, 
          fileName, 
          "text/plain"
        );
      } catch (error) {
        console.error(error);
      }
    },

    actionRating() {
      this.showModalRating = true
    },

    closeModal(){
      this.$emit("showModal", false)
      this.showModal = false
    },

    getRating(stars) {
      this.rating = stars
    },

    async submitRating() {
      try {
        const data = await submitRatingOrder(
          this.testResult.labId,
          this.order.serviceId,
          this.testResult.orderId,
          this.order.customerId,
          this.rating,
          this.review
        );

        this.ratingTestResult = data.rating;
        this.ratingTitle = `Rating ${this.ratingTestResult},0`;
        this.ratingSubTitle = data.review;

        this.showModalRating = false
        this.showModal = true
      } catch (error) {
        this.showModalRating = false
        this.showModal = true
        console.error(error);
      }
    }
  },

  computed: {
    ...mapState({
      api: (state) => state.substrate.api,
      wallet: (state) => state.substrate.wallet,
      mnemonicData: (state) => state.substrate.mnemonicData
    }),

    reportResult() {
      if (this.dialog) {
        return "";
      }

      if (this.resultLoading) {
        return "Decrypting report..";
      }
      
      return this.result ? this.result : "No report available for this result";
    },

    modalTitle() {
      return `Thank you! ${"\n"} Your feedback has been sent`
    }
  },

  rules: {
    document: {
      review: [ val => !!val || errorMessage.REQUIRED ]
    }
  }
}
</script>

<style lang="sass">
  .resultBody
    margin: 25px 0 0 0
  .buttonSection
    margin: 8px 0 45px 0
  .v-card__text
    height: 500px

</style>
