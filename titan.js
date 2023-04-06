const puppeteer = require('puppeteer');
const { Keyboard } = require('puppeteer');
const fs = require('fs');
(async() => {
    const browser = await puppeteer.launch({ headless: false });
    let professions;
    try {
        const rowJSON = fs.readFileSync('Professions.json', 'utf8');
        const json = JSON.parse(rowJSON);
        professions = json.professions;
    } catch (err) {
        console.log(err);
        return;
    }
    console.log("professions : ", professions)
    const file = fs.createWriteStream('log.csv');
    file.write("Intitulé;Prénom;Nom;Numéro\n");
    let page = await browser.newPage();
    const keyboard = page.keyboard;
    await page.setViewport({ width: 1903, height: 969 });
    console.log('\033[1;37m', '$> ', '\033[1;32m', 'Starting T I T A N');
    await page.goto('http://annuairesante.ameli.fr/', {
        waitUntil: "networkidle0"
    });
    await wait(1000);
    for (const element of professions) {
        console.log('\033[1;37m', '$> ', '\033[1;36m', "Recherche pour la profession : ", element);
// KEYBOARDING TO INPUT PROFESSION
            console.log("--- trace")
            page.focus('#formPro');
            await wait(500)
            console.log("--- trace")
            keyboard.type(element);
// SELECTION PROFESSION WITH THE DROPMENU
            await wait(1000)
            console.log('\033[1;37m', '$> ', '\033[1;32m', 'keydown', );
            await page.keyboard.press('ArrowDown');
            await wait(1000)
            console.log('\033[1;37m', '$> ', '\033[1;32m', 'entre', );
            await page.keyboard.press('Enter');
            await wait(1000)
// YOU RE SUPPOSED TO HAVE SELECTED  A RIGHT PROFESSION
            console.log('\033[1;37m', '$> ', '\033[1;32m', 'Profession entré', );
        await wait(500);
        console.log('\033[1;37m', '$> ', '\033[1;32m', 'Submit', );
        await Promise.all([
            page.waitForNavigation({ timeout: 100000 }),
            page.click("input[type='submit']")
        ]);
        console.log('\033[1;37m', '$> ', '\033[1;36m', "Recherche . . .");
        await wait(1000);
        let once = false;
        while (1) {
            const currentlist = await page.$$('.item-professionnel-inner');
            for (const currentProfile of currentlist) {
                const strongElementHandle = await currentProfile.$('h2 a strong');
                const firstNameElementHandle = await currentProfile.$('h2 a');
                const firstNameElement = await page.evaluate(el => el.innerHTML, firstNameElementHandle);
                const phoneNumberElement = await currentProfile.$('.elements .tel');
                try {
                    const phoneNumberText = await page.evaluate(phoneNumberElement => phoneNumberElement.textContent, phoneNumberElement);
                    // console.log(firstNameElementHandle)

                    let firstNameText = firstNameElement;
                    let firstname =  firstNameText.substring(firstNameText.indexOf("</strong>") + "</strong>".length);
                    if (firstNameElement) {
                        // console.log(firstNameElement)
                    } else {
                        console.log('No first name found');
                    }
                    // const firstNameText = await page.evaluate(firstNameElement => firstNameElement.textContent, firstNameElementHandle);

                    const strongText = await page.evaluate(strongElement => strongElement.textContent, strongElementHandle);

                            phoneNumberText[0] == '0' && (phoneNumberText[1] == '6' || phoneNumberText[1] == '7') ?
                            console.log('\033[1;32m', 'profil : ', strongText, ' ', firstname, ' - ',  phoneNumberText): 
                            console.log('\033[1;32m', 'profil : ', strongText, ' ', firstname, ' - ', '\033[1;31m', 'Not a personnal phone number : ', phoneNumberText, '\033[0m');

                    if (phoneNumberText[0] == '0' && (phoneNumberText[1] == '6' || phoneNumberText[1] == '7'))
                        file.write(element + ';' + firstname + ';' + strongText + ';' + phoneNumberText + '\n')
                } catch (err) {
                    console.log('\033[1;31m', 'Missing field', '\033[0m')
                }
            }
            const paginations = await page.$$(".pagination a");
            console.log("GET OF Paginations : ")
            console.log('\033[1;37m', '$> ', '\033[1;36m', 'Page suivante', '\033[0m')
            let rest = await Promise.all([
                page.waitForNavigation({ timeout: 100000 }),
                paginations.length == 8 ?
                    paginations[2].click() :
                paginations.length == 4 && once == false ?
                    (once = true,
                    paginations[0].click()) :(paginations[0].click(),
                    Promise.resolve('break')) // add a resolved promise here
            ]);
            if (rest.includes('break')) {
                console.log('\033[1;37m', '$> ', '\033[1;36m', 'Fin des profils associés à cette profession', '\033[0m')
                break;
            }
        }   

            // currentlist.forEach(element => {
            //     console.log('\033[1;37m', '$> ', '\033[1;32m', 'A trouvé :', element, '✔', '\033[0;37m');
            // });
            // console.log(temp);
            // return temp.map(element => element.href);
        // console.log(currentlist)
        await page.goto('http://annuairesante.ameli.fr/', {
            waitUntil: "networkidle0"
        });
    
    };
    console.log('\e[0m')
    file.end();

})();

function wait(timeout) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        }, timeout)
    })
}