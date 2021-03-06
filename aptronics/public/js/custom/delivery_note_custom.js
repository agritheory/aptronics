frappe.ui.form.on("Delivery Note", {
	refresh: (frm) => {
		get_gita_wh(frm);
		toggleNamingSeries(frm);
		aptronics.disallow_attachment_delete(frm)
	},
	onload_post_render: (frm) => {
		get_gita_wh(frm);
		frm.remove_custom_button("Sales Invoice", __('Create'));
		frm.add_custom_button(__('Sales Invoice'), () => {
			make_aptronics_sales_invoice(frm);
		},
		__('Create'));
		frm.remove_custom_button("Sales Return", __('Create'));
		frm.add_custom_button(__('Sales Return'), () => {
			make_aptronics_return_delivery(frm);
		},
		__('Create'));
	},
	is_return: (frm) => {
		toggleNamingSeries(frm);
	},
	before_cancel: (frm) => {
		aptronics.provide_cancellation_reason(frm);
	}
});

frappe.ui.form.on("Delivery Note Item", {
	items_add: (frm, cdn, cdt) => {
		get_gita_wh(frm, cdn, cdt);
	},
	warehouse: (frm, cdt, cdn) => {
		get_gita_wh(frm, cdt, cdn);
	}
});

function toggleNamingSeries(frm){
	if (frm.doc.docstatus != 0) {
		return;
	}

	if(frm.doc.is_return == 1){
		frm.doc.naming_series = 'SRH.#######';
	} else {
		frm.doc.naming_series = 'SDH.#######';
	}
	frm.refresh_field('naming_series');
}

function get_gita_wh(frm, cdt, cdn){
	if(frm.doc.docstatus != 0 || frm.doc.is_return == 1){
		return;
	}

	frappe.db.get_value("Company", frm.doc.company, 'default_goods_in_transit_warehouse', (r) => {
		if(!cdn){
			frm.doc.items.forEach((d) => {
				if(!d.target_warehouse){
					frappe.model.set_value(d.doctype, d.name, "target_warehouse", r.default_goods_in_transit_warehouse);
				}
			});
		} else {
			let d = locals[cdt][cdn];
			if(!d.target_warehouse){
				frappe.model.set_value(d.doctype, d.name, "target_warehouse", r.default_goods_in_transit_warehouse);
			}
		}
	});
}

function make_aptronics_sales_invoice(frm) {
	frappe.model.open_mapped_doc({
		method: "aptronics.overrides.make_aptronics_sales_invoice",
		frm: frm
	});
}

function make_aptronics_return_delivery(frm) {
	frappe.model.open_mapped_doc({
		method: "aptronics.overrides.make_aptronics_return_delivery",
		frm: frm
	});
}
