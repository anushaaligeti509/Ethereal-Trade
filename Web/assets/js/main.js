/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    // When we click on each nav__link, we remove the show-menu class
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

/*=============== HOME SWIPER ===============*/
let homeSwiper = new Swiper(".home-swiper", {
    spaceBetween: 30,
    loop: 'true',
    
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
})

/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader(){
    const header = document.getElementById('header')
    // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*=============== NEW SWIPER ===============*/
let newSwiper = new Swiper(".new-swiper", {
    centeredSlides: true,
    slidesPerView: "auto",
    loop: 'true',
    spaceBetween: 16,
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id')

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.add('active-link')
        }else{
            document.querySelector('.nav__menu a[href*=' + sectionId + ']').classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)

/*=============== SHOW SCROLL UP ===============*/ 
function scrollUp(){
    const scrollUp = document.getElementById('scroll-up');
    // When the scroll is higher than 460 viewport height, add the show-scroll class to the a tag with the scroll-top class
    if(this.scrollY >= 460) scrollUp.classList.add('show-scroll'); else scrollUp.classList.remove('show-scroll')
}
window.addEventListener('scroll', scrollUp)

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
    // reset: true
})

sr.reveal(`.home-swiper, .new-swiper, .newsletter__container`)
sr.reveal(`.category__data, .trick__content, .footer__content`,{interval: 100})
sr.reveal(`.about__data, .discount__img`,{origin: 'left'})
sr.reveal(`.about__img, .discount__data`,{origin: 'right'})

document.addEventListener('DOMContentLoaded', function () {
    const app = {
        ethereum: window.ethereum,
        provider: null,
        signer: null,
        contract: null,
        accounts: null,
        contractAddress: "0x49ba8889cf16892a9b1fb215382bd288f92cf7bf", // Update with your contract address
        erc20Abi: [
            "function name() view returns (string)",
            "function symbol() view returns (string)",
            "function totalSupply() view returns (uint256)",
            "function balanceOf(address) view returns (uint256)",
            "function transfer(address to, uint256 amount) returns (bool)"
        ],
        domElements: {
            connectBtn: document.getElementById('connect-btn'),
            contractTitle: document.getElementById('contract-title'),
            totalSupplyEl: document.getElementById('total-supply-el'),
            userBalanceEl: document.getElementById('user-balance-el'),
            feedbackMsgEl: document.getElementById('feedback-msg'),
            errorMsgEl: document.getElementById('error-msg'),
            changestatus: document.getElementById('changestatus')
        },

        init: function() {
            this.bindEvents();
            this.checkWallet();
        },

        bindEvents: function() {
            this.domElements.connectBtn.addEventListener('click', this.connectWallet.bind(this));
        },

        checkWallet: function() {
            if (!this.ethereum) {
                this.displayError("Please install MetaMask to use this site.");
                return;
            }
            this.provider = new ethers.providers.Web3Provider(this.ethereum);
        },

        connectWallet: async function() {
            try {
                this.accounts = await this.provider.send("eth_requestAccounts", []);
                this.signer = this.provider.getSigner();
                this.updateContractDetails();
            } catch (error) {
                this.displayError("Failed to connect wallet. " + error.message);
            }
        },
        
        updateContractDetails: async function() {
            try {
                this.contract = new ethers.Contract(this.contractAddress, this.erc20Abi, this.signer);
                const name = await this.contract.name();
                const symbol = await this.contract.symbol();
                const totalSupply = await this.contract.totalSupply();
                const userBalance = await this.contract.balanceOf(this.accounts[0]);

                this.domElements.contractTitle.innerText = `${name} (${symbol})`;
                this.domElements.totalSupplyEl.innerText = ethers.utils.formatUnits(totalSupply, 18);
                this.domElements.userBalanceEl.innerText = ethers.utils.formatUnits(userBalance, 18);
                this.displayFeedback("Contract details updated successfully.");
            } catch (error) {
                this.displayError("Failed to fetch contract details. " + error.message);
            }
        },

        displayFeedback: function(message) {
            this.domElements.feedbackMsgEl.innerText = message;
            setTimeout(() => {
                this.domElements.feedbackMsgEl.innerText = '';
            }, 5000);
        },

        displayError: function(message) {
            this.domElements.errorMsgEl.innerText = message;
            setTimeout(() => {
                this.domElements.errorMsgEl.innerText = '';
            }, 5000);
        }
    };

    app.init();
});

document.getElementById('shipcreate-btn').addEventListener('click', async function() {
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);

        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];

            console.log('Connected account:', account);

            const contractAddress = '0x49ba8889cf16892a9b1fb215382bd288f92cf7bf'; // Replace with your contract address
            const abi = [
                {
                    "constant": false,
                    "inputs": [{"name": "_receiver", "type": "address"}, {"name": "_amount", "type": "uint256"}],
                    "name": "createShipment",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ];

            const contract = new web3.eth.Contract(abi, contractAddress);

            // Get receiver address and shipment amount from input fields
            const receiver = document.getElementById('receiverAddress').value;
            const amount = document.getElementById('shipmentAmount').value;

            // Call createShipment function
            await contract.methods.createShipment(receiver, amount).send({ from: account });

            alert("Shipment Created");
            console.log('Shipment created');

        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            alert('Failed to connect to MetaMask. Please ensure that it is installed and that you are logged in.');
        }
    } else {
        alert('Please install MetaMask!');
    }
});

document.getElementById('update-status-btn').addEventListener('click', async function() {
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);

        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];

            console.log('Connected account:', account);

            const contractAddress = '0x49ba8889cf16892a9b1fb215382bd288f92cf7bf'; // Replace with your contract address
            const abi = [
                {
                    "constant": false,
                    "inputs": [{"name": "_id", "type": "uint256"}, {"name": "_status", "type": "uint8"}],
                    "name": "updateShipmentStatus",
                    "outputs": [],
                    "payable": false,
                    "stateMutability": "nonpayable",
                    "type": "function"
                }
            ];

            const contract = new web3.eth.Contract(abi, contractAddress);

            // Get shipment ID and status from input fields
            const shipmentId = document.getElementById('shipmentId').value;
            const shipmentStatus = document.getElementById('statusSelect').value;

            // Call updateShipmentStatus function
            await contract.methods.updateShipmentStatus(shipmentId, shipmentStatus).send({ from: account });

            alert("Shipment Status Updated");
            console.log('Shipment status updated');

        } catch (error) {
            console.error('Error connecting to MetaMask:', error);
            alert('Failed to connect to MetaMask. Please ensure that it is installed and that you are logged in.');
        }
    } else {
        alert('Please install MetaMask!');
    }
});
