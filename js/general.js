$(document).ready(function() {
	
	$("#btn-add-product").click(function(event){
	    event.preventDefault(); 
	    addProductList();
	}); 

	$('#tab-page-selector').find('ul').find('li').each(function(idx) {
		var opts = $(this);
		opts.click( function(event) {
	    	//event.preventDefault();  
			if(idx==0) { 
		    	activePageTab($('#page-1')); 
				activePageTabHeader(1)
			} else {
				$('#page-'+idx).find('.footer').find(".btn-next").click();  
			}  
		})
	})

	$('#page-4').find('.items').find('.item').each(function(idx) {
		var opts = $(this);
		opts.find('.btn-container').find('.btn-add').click(function(event){
	    	event.preventDefault();  
			var opt = $(this);
			var id = opt.attr('data-id');
			var name = opt.attr('data-name');
			var priceUnit = opt.attr('data-price-unit');
			var priceDscto = opt.attr('data-dscto'); 
			var numStock = opt.attr('data-stock'); 
			setListProduct(id,name,priceUnit,priceDscto,numStock);
		})
	})

	try{
	CKEDITOR.replace( 'ckeditor', {
		removeButtons: 'Underline,JustifyCenter',
		removePlugins: 'elementspath,save,font,paste',
		enterMode: CKEDITOR.ENTER_BR, 
		shiftEnterMode: CKEDITOR.ENTER_DIV
	});
	}catch{};
});

function backPage(currentPage,pageBack) {
	show($('#'+pageBack));
	hidde($('#'+currentPage)); 

	pageTab = pageBack.replace('page-','');
	activePageTabHeader(pageTab)
}

function show(page) {
	page.css('display', 'block');
}

function hidde(page) {
	page.css('display', 'none');
}

var firstEmptySelect = true;
function formatSelect(result) {
    if (!result.id) {
        if (firstEmptySelect) {
            //console.log('showing row');
            firstEmptySelect = false;
            return '<div class="row">' +
                    '<div class="col-md-2 text-center"><b>Código</b></div>' +
                    '<div class="col-md-4"><b>Producto</b></div>' +
                    '<div class="col-md-2 text-right"><b>Stock</b></div>' +
                    '<div class="col-md-2 text-right"><b>Precio Unit.</b></div>' +
                    '<div class="col-md-2 text-right"><b>Dscto.</b></div>' +
                    '</div>';
        } else {
            //console.log('skipping row');
            return false;
        }
        console.log('result');
        console.log(result);
    }
    return '<div class="row">' +
                 '<div class="col-md-2 text-center search-product-id">' + result.id + '</div>' +
                 '<div class="col-md-4 search-product-name">' + result.name + '</div>' + 
                 '<div class="col-md-2 text-right search-product-stock">' + result.stock + '</div>' + 
                 '<div class="col-md-2 text-right search-product-price">' + result.price + '</div>' + 
                 '<div class="col-md-2 text-right search-product-dscto">' + result.dscto + '</div>' + 
                 '</div>';      
}
function matcher(query, option) {
    firstEmptySelect = true;
    if (!query.term) {
        return option;
    }
    var has = true;
    var words = query.term.toUpperCase().split(" ");
    for (var i =0; i < words.length; i++){
        var word = words[i];
        has = has && (option.text.toUpperCase().indexOf(word) >= 0);  
    }
    if (has) return option;
    return false;
} 

function calculateSubTotalRow() {
	$("#table-products").find('table').find('tbody').find('tr').each(function(){
		var rows = $(this);
		rows.find('td').each(function(){
			var row = $(this);
			row.find('input.quantity').change(function() {
				var inp = $(this);
				var quantity = inp.val();
				var rowId = inp.parent().parent().attr('id');
				calculateSubTotal(rowId,quantity); 
			});

			row.find('a.btn-delete').click(function(event) {
				event.preventDefault(); 
				if(confirm("¿Deseas eliminar el producto de tu lista de pedido?")) {
					rows.remove();
					calculateTotal();
					generateNumbersTable();
					validExistProductsTable();
				}
			})  
		})  
	})
}

function calculateSubTotal(rowId,quantity) {
	var row = $("#table-products").find('table').find('tbody').find('tr#'+rowId);
	var priceUnit = parseFloat(row.find('.price-unit').text().replace('S/ ',''));
	var priceDscto = parseFloat(row.find('.price-dscto').text().replace('S/ ',''));
	var priceUnitSubTotal = quantity*priceUnit
	var priceDsctoSubTotal = quantity*priceDscto;
	var calculoSubTotal = parseFloat(priceUnitSubTotal-priceDsctoSubTotal).toFixed(2); 
	row.find('.sub-total').text('S/ '+calculoSubTotal);
	calculateTotal();
}

function addProductList() {
	var select = $('#select2-search-product-container > .row');
	var id = select.find('.search-product-id').text();
	var name = select.find('.search-product-name').text();
	var stock = select.find('.search-product-stock').text();
	var numStock = $("<span>").html(stock).text();

	var price = select.find('.search-product-price').text();
	var dscto = select.find('.search-product-dscto').text();
	setListProduct(id,name,price,dscto,numStock);
	/*
	var priceUnitSubTotal = parseFloat(priceUnit-priceDscto).toFixed(2); 

	if(priceUnitSubTotal=='NaN') {
		alert('Selecciona un producto');
	} else {
		if(numStock == 0) {
			alert('El producto no tiene Stock');
		} else {
			$('#table-products-content').css('display', 'block');
			var table = $("#table-products").find('table').find('tbody');
			var htmlRow = `<tr id="`+id+`">  
			                    <td class="text-center">`+id+`</td>
			                    <td>`+name+`</td>
			                    <td class="text-right price-unit">`+price+`</td>
			                    <td class="text-right price-dscto">`+dscto+`</td>
			                    <td class="text-center"><input type="number" class="form-control quantity" value="1" name="price[`+id+`]" name="price[`+id+`]" max="`+numStock+`" min="1"></td>
			                    <td class="text-right text-strong sub-total">S/ `+priceUnitSubTotal+`</td>
			                    <td class="text-center"><a href="#" class="btn btn-delete" title="Borrar de la lista">Borrar</a></td>
			                </tr>`;
			table.html(table.html()+htmlRow);
			calculateSubTotalRow();
		}
	}*/
}

function setListProduct(id,name,price,dscto,numStock) {

	numStock = numStock.replace('unids.',''); 
	numStock = numStock.replace(' ',''); 

	var priceUnit = parseFloat(price.replace('S/ ',''));
	var priceDscto = parseFloat(dscto.replace('S/ ','')); 
	var priceUnitSubTotal = parseFloat(priceUnit-priceDscto).toFixed(2); 

	if(priceUnitSubTotal=='NaN') {
		alert('Selecciona un producto');
	} else {
		if(numStock == 0) {
			alert('El producto no tiene Stock');
		} else {
			$('#table-products-content').css('display', 'block');
			var table = $("#table-products").find('table').find('tbody');
			var htmlRow = `<tr id="`+id+`">  
			                    <td class="text-center">`+id+`</td>
			                    <td>`+name+`</td>
			                    <td class="text-right price-unit">`+price+`</td>
			                    <td class="text-right price-dscto">`+dscto+`</td>
			                    <td class="text-center"><input type="number" class="form-control quantity" value="1" name="price[`+id+`]" name="price[`+id+`]" max="`+numStock+`" min="1"></td>
			                    <td class="text-right text-strong sub-total">S/ `+priceUnitSubTotal+`</td>
			                    <td class="text-center"><a href="#" class="btn btn-delete" title="Borrar de la lista">Borrar</a></td>
			                </tr>`;
			table.html(table.html()+htmlRow);
			calculateSubTotalRow();
		}
	}
}

function validExistProductsTable() {
	var rows = $("#table-products").find('table').find('tbody').find('tr').length;	
	if(rows == 0) {
		$('#table-products-content').css('display', 'none');
	}
}

function activePageTabHeader(page) { 
	
	var pageTab = page;
	if(page.selector !== undefined) {
		pageTab = page.selector;
		pageTab = pageTab.replace('#page-',''); 
	}
	console.log(pageTab)
	$('#tab-page-selector').find('ul').find('li').find('a').removeClass('active')
	$('#tab-page-selector').find('ul').find('li').find('a#tab-page-'+pageTab).addClass('active');
}

function getCountProduct() {
	return $("#table-products").find('table').find('tbody').find('tr').length;
}

function activePageTab(page){
	var ctaPages = $('.tab-page').length;
	for (var i = 0; i <= ctaPages; i++) {
		var pages = $('#page-'+i);
		hidde(pages);	
	}
	show(page);
}