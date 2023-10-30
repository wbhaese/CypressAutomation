/// <references types="cypress" />
import { format, prepareLocalStorage } from '../../support/utils'

//Configuração para testes mobile
//cy.viewport
//arquivos de configuração
//configs por linha de comando:
//npx cypress open --config viewportWidth=411, viewportHeight=823


context('Test homepage of DevFinances', () => {
    //hooks
    beforeEach(() => {
        cy.visit('https://dev-finance.netlify.app/', {
			onBeforeLoad: (win) => {
				prepareLocalStorage(win);
			}
		});


        //should not have rows registered
        //cy.get('#data-table tbody tr').should('have.length', 2);
    });

    it('Cadastrar entradas', () => {
        //entender o fluxo manualmente
        //mapear os elementos que vamos interagir
        cy.get('#transaction .button')//find by id and class
        .click();

        cy.get('#description').type('Salary');//id

        cy.get('[name=amount]').type(12);

        cy.get('[type=date]').type('2023-11-23');//type

        cy.get('button').contains('Salvar').click();//type and value

        //assert number of registered rows
        cy.get('#data-table tbody tr').should('have.length', 1);
        
    });

    //cadastrar saídas
    it('Cadastrar Saídas', () => {
        //cy.get('#data-table tbody tr').should('have.length', 0);

        //entender o fluxo manualmente
        //mapear os elementos que vamos interagir
        cy.get('#transaction .button')//find by id and class
        .click();

        cy.get('#description').type('Lunch');//id

        cy.get('[name=amount]').type(-22);

        cy.get('[type=date]').type('2023-12-14');//type

        cy.get('button').contains('Salvar').click();//type and value

        //assert number of registered rows
        cy.get('#data-table tbody tr').should('have.length', 1);
        
    });

    //Remover entradas e saídas
    it('Remove all registers', () => {
        let entrada = 'mesada';
        let saida = 'almoco';

        cy.get('#transaction .button').click();
        cy.get('#description').type(entrada);//id
        cy.get('[name=amount]').type(22);
        cy.get('[type=date]').type('2023-12-14');//type
        cy.get('button').contains('Salvar').click();//type and value

        //confirm income value 
        cy.get('#incomeDisplay').should('contain.text', '22,00');

        //add negative value
        cy.get('#transaction .button').click();
        cy.get('#description').type(saida);//id
        cy.get('[name=amount]').type(-32);
        cy.get('[type=date]').type('2023-12-14');//type
        cy.get('button').contains('Salvar').click();//type and value

        //confirm out value
        cy.get('#expenseDisplay').should('contain.text', '32,00');

        //assert number of registered rows
        cy.get('#data-table tbody tr').should('have.length', 2);

        //Confirm total amount
        cy.get('#totalDisplay').should('contain.text', '-');

        //estratégia: Ir ao elemento pai
        cy.get('td.description').contains(entrada).parent().find('img[onclick*=remove]').click();
        
        //estratégia 2: buscar todos os irmãos e buscar o ue possui o img + attr
        cy.get('td.description').siblings().children('img[onclick*=remove]').click();

        cy.get('#data-table tbody tr').should('have.length', 0);
        cy.get('#incomeDisplay').should('contain.text', '0,00');
        cy.get('#expenseDisplay').should('contain.text', '0,00');
        cy.get('#totalDisplay').should('contain.text', '0,00');


    });

    it.only('Validar saldo com diversas transações', () => {
        /*removed these lines because added registers by localstorage
		let entrada = 'mesada';
        let saida = 'almoco';

        cy.get('#transaction .button').click();
        cy.get('#description').type(entrada);//id
        cy.get('[name=amount]').type(22);
        cy.get('[type=date]').type('2023-12-14');//type
        cy.get('button').contains('Salvar').click();//type and value

        //confirm income value 
        cy.get('#incomeDisplay').should('contain.text', '22,00');

        //add negative value
        cy.get('#transaction .button').click();
        cy.get('#description').type(saida);//id
        cy.get('[name=amount]').type(-32);
        cy.get('[type=date]').type('2023-12-14');//type
        cy.get('button').contains('Salvar').click();//type and value
        */
	   
        //Capturar as linhas
		//Capturar os textos das colunas que possuem valor
        //using each() function to catch each line

		let incomes = 0;
		let expenses = 0;

        cy.get('#data-table tbody tr').each(($el, index, $list) => {
			cy.get($el).find('td.income, td.expense').invoke('text').then(text => {
				if(text.includes('-')){
					expenses = expenses + format(text) 
				}else{
					incomes = incomes + format(text)
				}
				cy.log('entradas', incomes)
				cy.log('saídas',expenses)

			});
        });

		cy.get('#totalDisplay').invoke('text').then(text => {
			let formattedTotalDisplay = format(text)
			let expectedTotal = incomes + expenses;

			expect(formattedTotalDisplay).to.eq(expectedTotal)


		});



        //formatar os valores da linha (remover strings e vírgula)

        //capturar o texto do total
		//formatar o texto das colunas
        //comparar o somatório de entradas e despesas total

        
    });
    //entender o fluxo
    //mapear os elementos da interface
    //descrever as interações com cypress
    //adicionar as asserções (comparativos) que preciamos
});