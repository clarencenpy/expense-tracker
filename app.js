$(function() {
    Store.init();
    App.init();
});

var App = {

    init: function() {
        console.log('starting app...');
        App.compileTemplates();
        App.bindEvents();
        App.initPlugins();
        App.refresh();
    },

    compileTemplates: function() {
        var source = $('#expense-list-template').html();
        this.expenseListGenerator = Handlebars.compile(source);
    },

    loadExpenses: function() {
        var html = App.expenseListGenerator(Store.expenses);
        $('#expense-list').html(html);
    },

    loadProgress: function() {
        var totalSpending = 0;
        for (var i = 0; i < Store.expenses.length; i++) {
            var expense = Store.expenses[i];
            totalSpending += Number(expense.price);
        }

        $('#jqmeter').jQMeter({
            goal: Store.budget + '',
            raised: totalSpending + '',
        });
    },

    bindEvents: function() {
        $('#add-expense-btn').on('click', function() {
            $('#add-expense-modal').openModal();
        });

        $('#add-expense-modal').on('click', '.done-btn', function() {
            //select the user input fields
            var $desc = $('#add-expense-modal #desc');
            var $price = $('#add-expense-modal #price');
            var $category = $('#add-expense-modal #category');

            var expense = {
                desc: $desc.val(),
                price: $price.val(),
                category: $category.val()
            };

            //clear input values
            $desc.val('');
            $price.val('');
            $category.val('');

            //add expense and refresh
            Store.addExpense(expense);
            App.refresh();
        });

        $('#edit-budget-btn').on('click', function() {
        	$('#edit-budget-modal').openModal();
        });

        $('#edit-budget-modal').on('click', '.done-btn', function () {
        	var $budget = $('#edit-budget-modal #budget');
        	Store.setBudget($budget.val());
        	$budget.val('');
        	App.loadProgress();
        });

    },

    initPlugins: function() {
    	//dropdown select
        $('select').material_select();

        //pie chart
        var ctx = $('#category-chart').get(0).getContext("2d");
		this.pieChart = new Chart(ctx);
    },

    loadPieChart: function() {
		var data = [{
			value: 0,
			color: "#F7464A",
			highlight: "#FF5A5E",
			label: "Food"
		}, {
			value: 0,
			color: "#46BFBD",
			highlight: "#5AD3D1",
			label: "Transport"
		}, {
			value: 0,
			color: "#FDB45C",
			highlight: "#FFC870",
			label: "Shopping"
		}, {
			value: 0,
			color: "#FDF45C",
			highlight: "#FFF870",
			label: "Education"
		}];

		Store.expenses.forEach(function(expense) {
			if (expense.category === 'food') {
				data[0].value += Number(expense.price);
			}
			if (expense.category === 'transport') {
				data[1].value += Number(expense.price);
			}
			if (expense.category === 'shopping') {
				data[2].value += Number(expense.price);
			}
			if (expense.category === 'education') {
				data[3].value += Number(expense.price);
			}

		});

		this.pieChart.Doughnut(data, {
			animateScale : true,
			animationEasing: 'easeOut',
			animationSteps: 30
		});
	},

    refresh: function() {
        App.loadExpenses();
        App.loadProgress();
        App.loadPieChart();
    }
};

var Store = {

	//default values
    expenses: [],
    budget: 500,

    init: function() {
        var data = localStorage.getItem('expenses');
        if (data !== null) {
            Store.expenses = JSON.parse(data);
        }

        var budget = localStorage.getItem('budget');
        if (budget !== null) {
        	Store.budget = budget;
        }
    },

    addExpense: function(expense) {
        Store.expenses.unshift(expense);
        localStorage.setItem('expenses', JSON.stringify(Store.expenses));
    },

    setBudget: function(budget) {
    	Store.budget = budget;
    	localStorage.setItem('budget', budget);
    }

};
