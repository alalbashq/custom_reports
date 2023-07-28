import frappe

@frappe.whitelist()
def get_del_invoice_note(inv):
    return frappe.get_list("Delivery Note",filters={"docstatus": 1, "ref_sales_invoice" : inv},fields=["*"], ignore_permissions=True)

@frappe.whitelist()
def get_del_order_note(inv):
    return frappe.get_list("Delivery Note",filters={"docstatus": 1, "ref_sales_order" : inv},fields=["*"], ignore_permissions=True)

