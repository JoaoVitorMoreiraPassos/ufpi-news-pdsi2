// Importa os módulos necessários
const express = require('express');
const puppeteer = require('puppeteer');

// Configuração do servidor Express
const app = express();
const port = 3001;
app.use(express.json());

/**
 * Função assíncrona para realizar login em uma página.
 * @param {Object} page - A página Puppeteer.
 * @param {string} user - O nome de usuário.
 * @param {string} password - A senha.
 */
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
}

// Rota para obter as disciplinas
app.post('/api/subjects', async (req, res) => {
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
});

/**
 * Função assíncrona para obter as disciplinas do usuário.
 * @param {string} user - O nome de usuário.
 * @param {string} password - A senha.
 * @returns {Array} Array de objetos contendo as disciplinas.
 */
async function getSubjects(user, password) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await login(page, user, password);

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

// Rota para obter as tarefas de uma disciplina
app.post('/api/tasks', async (req, res) => {
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
});

/**
 * Função assíncrona para obter as tarefas de uma disciplina.
 * @param {string} user - O nome de usuário.
 * @param {string} password - A senha.
 * @param {string} accessId - O id de acesso à disciplina.
 * @returns {Array} Array de objetos contendo as tarefas.
 */
async function getTasks(user, password, accessId) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await login(page, user, password);

    if (page.url !== 'https://sigaa.ufpi.br/sigaa/verPortalDiscente.do') {
        const goMainButtonHref = "/sigaa/verPortalDiscente.do";
        try {
            await Promise.all([
                page.waitForNavigation(),
                page.click(`a[href="${goMainButtonHref}"]`)
            ]);
        } catch {
            return {
                error: "Erro ao buscar tarefas",
                data: []
            }
        }
    }

    try {
        await Promise.all([
            page.waitForNavigation(),
            page.click(`#${accessId}`),
        ]);
    } catch (e) {
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

// Inicia o servidor na porta especificada
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
