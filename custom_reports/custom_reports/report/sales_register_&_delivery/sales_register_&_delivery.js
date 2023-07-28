// Copyright (c) 2023, Albashq Alshwmy and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Sales Register & Delivery"] = {
	"filters": [
		{
			"fieldname":"from_date",
			"label": __("From Date"),
			"fieldtype": "Date",
			"default": frappe.datetime.add_months(frappe.datetime.get_today(), -1),
			"width": "80"
		},
		{
			"fieldname":"to_date",
			"label": __("To Date"),
			"fieldtype": "Date",
			"default": frappe.datetime.get_today()
		},
		{
			"fieldname":"customer",
			"label": __("Customer"),
			"fieldtype": "Link",
			"options": "Customer"
		},
		{
			"fieldname":"company",
			"label": __("Company"),
			"fieldtype": "Link",
			"options": "Company",
			"default": frappe.defaults.get_user_default("Company")
		},
		{
			"fieldname":"mode_of_payment",
			"label": __("Mode of Payment"),
			"fieldtype": "Link",
			"options": "Mode of Payment"
		},
		{
			"fieldname":"owner",
			"label": __("Owner"),
			"fieldtype": "Link",
			"options": "User"
		},
		{
			"fieldname":"cost_center",
			"label": __("Cost Center"),
			"fieldtype": "Link",
			"options": "Cost Center"
		},
		{
			"fieldname":"warehouse",
			"label": __("Warehouse"),
			"fieldtype": "Link",
			"options": "Warehouse"
		},
		{
			"fieldname":"brand",
			"label": __("Brand"),
			"fieldtype": "Link",
			"options": "Brand"
		},
		{
			"fieldname":"item_group",
			"label": __("Item Group"),
			"fieldtype": "Link",
			"options": "Item Group"
		}
	],
	"formatter": function (value, row, column, data, default_formatter) {	
		console.log(row)	 
		
		if (  data && column.fieldname=="invoice_delivery_note") {
			console.log("column",column)
			console.log("row",row)
			
			value = `<span style='color:red' onclick='showDialog("${value}","${row[1].content}")' >` + value + "</span>";
		}
		if ( data && column.fieldname=="sales_order") {
			column.link_onclick = `showDialog1("${value}")`
			value =  data["sales_order"];
		}
		value = default_formatter(value, row, column, data);

		return value;
	},
};

async function  showDialog1(sales_order) {
	// Create a dialog box
	console.log(sales_order)
	let doc= await frappe.db.get_doc("Sales Order",sales_order )
	console.log(doc)
  
	// var words = text.split(",")
	var links="<tr><th>Delivery Note</th><th>Total Quantity</th><th>Net Total</th> <th>Date</th>  </tr>"
	 
 
	
	let del = await  frappe.call({method: "custom_reports.utils.get_del_order_note",args:{inv : sales_order}});
	  console.log(del.message)
	  del.message.forEach( l => {
		
		links+=`<tr><td><a href="/app/delivery-note/${l.name}" data-doctype="Delivery Note" data-name="${l.name}">${l.name}</a></td><td>${l.total_qty}</td><td>${l.net_total} ${l.currency}</td><td>${l.posting_date}</td>`
	});
	let d = new frappe.ui.Dialog({
		title: sales_order,
		fields: [
			{
				fieldname: 'first_name1',
				fieldtype: 'HTML',
				options:  `<table class='table table-bordered table-condensed'>
							<tr><th>Sales Order</th><th>Total Quantity</th><th>Net Total</th> <th>Date</th>  </tr>
							<tr><td><a href="/app/sales-order/${doc.name}" data-doctype="Delivery Note" data-name="${doc.name}">${doc.name}</a></td><td>${doc.total_qty}</td><td>${doc.net_total} ${doc.currency}</td><td>${doc.posting_date}</td></table>`,
			},		 
			{
				fieldname: 'first_name',
				fieldtype: 'HTML',
				options:  "<table class='table table-bordered table-condensed'>"+links+"</table>",
			}		 
		],
		size: ' extra-large', // small, large, extra-large 	 
		 
	});
	
	d.show();
  }

async function  showDialog(text,inv) {
	// Create a dialog box
	console.log(inv)
	let doc= await frappe.db.get_doc("Sales Invoice",inv )
	console.log(doc)
  
	var words = text.split(",")
	var links="<tr><th>Delivery Note</th><th>Total Quantity</th><th>Net Total</th> <th>Date</th>  </tr>"
	 
 
	
	let del = await  frappe.call({method: "custom_reports.utils.get_del_invoice_note",args:{inv : inv}});
	  console.log(del.message)
	  del.message.forEach( l => {
		
		links+=`<tr><td><a href="/app/delivery-note/${l.name}" data-doctype="Delivery Note" data-name="${l.name}">${l.name}</a></td><td>${l.total_qty}</td><td>${l.net_total} ${l.currency}</td><td>${l.posting_date}</td>`
	});
	let d = new frappe.ui.Dialog({
		title: inv,
		fields: [
			{
				fieldname: 'first_name1',
				fieldtype: 'HTML',
				options:  `<table class='table table-bordered table-condensed'>
							<tr><th>Sales Invoice</th><th>Total Quantity</th><th>Net Total</th> <th>Date</th>  </tr>
							<tr><td><a href="/app/sales-invoice/${doc.name}" data-doctype="Delivery Note" data-name="${doc.name}">${doc.name}</a></td><td>${doc.total_qty}</td><td>${doc.net_total} ${doc.currency}</td><td>${doc.posting_date}</td></table>`,
			},		 
			{
				fieldname: 'first_name',
				fieldtype: 'HTML',
				options:  "<table class='table table-bordered table-condensed'>"+links+"</table>",
			}		 
		],
		size: ' extra-large', // small, large, extra-large 	 
		 
	});
	
	d.show();
  }
  