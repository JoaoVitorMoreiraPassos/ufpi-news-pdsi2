import puppeteer from 'puppeteer';

async function login(page, user, password) {
    await page.goto('https://sigaa.ufpi.br/sigaa/verTelaLogin.do');

    await page.evaluate((user, password) => {
        document.querySelector('input[name="user.login"]').value = user;
        document.querySelector('input[name="user.senha"]').value = password;
    }, user, password);

    await Promise.all([
        page.click('input[type="submit"]'),
        page.waitForNavigation()
    ]);

    if (page.url !== 'https://sigaa.ufpi.br/sigaa/verPortalDiscente.do') {
        const goMainButtonHref = "/sigaa/verPortalDiscente.do";
        try {
            await Promise.all([
                page.waitForNavigation(),
                page.click(`a[href="${goMainButtonHref}"]`)
            ]);
        } catch {
            return {
                data: []
            }
        }
    }
}

async function getSubjects(user, password) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await login(page, user, password);

    const linksObj = await page.evaluate(() => {
        const linksArray = Array.from(document.querySelectorAll('a'));
        return linksArray.map(link => {
            if (link.id.includes('form_acessarTurmaVirtual')) {
                return {
                    id: link.id.split(":").join("\\:"),
                    content: link.textContent
                };
            }
        });
    });

    let linksObjFiltered = linksObj.filter(link => link != undefined);

    let responses = []
    for (let i = 0; i < linksObjFiltered.length; i++) {
        responses.push({
            subject: linksObjFiltered[i].content,
            accessId: linksObjFiltered[i].id
        });
    }
    await browser.close();
    return responses;
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { user, password } = req.body;

        if (!user || !password) {
            return res.status(400).json({ error: 'Nome de usuário e senha são obrigatórios.' });
        }

        try {
            const result = await getSubjects(user, password);
            res.json({ data: result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
