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

async function getTasks(user, password, accessId) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await login(page, user, password);

    try {
        await Promise.all([
            page.waitForNavigation(),
            page.click(`#${accessId}`),
        ]);
    } catch (e) {
        console.error(e);
        // Se houver um erro ao clicar no link da disciplina, retorna um objeto vazio
        return {
            error: "Erro ao buscar tarefas",
            tasks: []
        }
    }

    // Localiza o contêiner das tarefas
    const TaskContainer = await page.evaluate(() => {
        const taskContainer = Array.from(document.querySelectorAll('div')).find(link => link.className.includes('rich-panelbar-header-act  itemMenuHeaderAtividades'));
        return taskContainer ? `div .${taskContainer.classList[1]}` : null;
    });

    try {
        if (TaskContainer) {
            await page.click(TaskContainer);
        }
    } catch (e) {
        console.error(e)
        return {
            error: "Erro ao buscar tarefas",
            tasks: []
        }
    }

    let linkToTasksSelector;
    try {
        // Localiza o link para as tarefas
        linkToTasksSelector = await page.evaluate(() => {
            const linkToTasks = Array.from(document.querySelectorAll('a')).find(link => link.textContent.includes('Tarefas'));
            return linkToTasks ? `a[onclick="${linkToTasks.getAttribute('onclick')}"]` : null;
        });

    } catch (e) {
        console.error(e)
        return {
            error: "Erro ao buscar tarefas",
            tasks: []
        }
    }

    if (linkToTasksSelector) {
        // Se encontrado, clica no link para as tarefas
        await Promise.all([
            page.waitForNavigation(),
            page.click(linkToTasksSelector)
        ]);
    }

    // Extrai os dados das tarefas da tabela
    const table = await page.evaluate(() => {
        const table = Array.from(document.querySelectorAll('table')).find(link => link.className.includes('listing'));
        const rows = table ? Array.from(table.querySelectorAll('tr')) : null;

        return rows ? rows.map(row => {
            const columns = Array.from(row.querySelectorAll('td'));
            const tratamento_1 = columns.map(column => column.textContent.trim());
            const tratamento_2 = tratamento_1.map(column => column.replace(/\t/g, ''));
            return tratamento_2
        }) : null;
    });

    await browser.close();
    let new_table = []
    if (table) {
        let count = 1
        const len = table.length
        for (let i = 0; i < len; i++) {
            let item = table.shift();
            try {
                if (item.length > 1) {
                    const key = `task_${count}`
                    let date = item[3]
                    date = date.replace(" ", "")
                    date = date.replace("de", "")
                    date = date.replace("\na", "|")
                    date = date.replace("às", "")
                    date = date.replace("às", "")
                    date = date.replace("/", "-")
                    date = date.replace("/", "-")
                    date = date.replace("/", "-")
                    date = date.replace("/", "-")
                    date = date.replace("h", ":")
                    date = date.replace("h", ":")
                    date = date.split("|")

                    const dict = {
                        key: key,
                        infos: {
                            title: item[1],
                            date: {
                                init: date[0],
                                end: date[1]
                            },
                            is_send: item[7],
                            content: ""
                        }
                    }
                    new_table.push(dict)
                }
                else {
                    if (item.length === 0) {
                        continue;
                    }
                    new_table[new_table.length - 1].infos.content = item[0]
                    count++;
                }
            }
            catch (erro) {
                console.error(erro)
                return {
                    error: "Erro ao buscar tarefas",
                    tasks: []
                }
            }
        }
    }
    return {
        tasks: new_table
    };
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { user, password, accessId } = req.body;

        if (!user || !password || !accessId) {
            return res.status(400).json({ error: 'Nome de usuário, senha e id de acesso são obrigatórios.' });
        }

        try {
            const result = await getTasks(user, password, accessId);
            res.json({ data: result });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
