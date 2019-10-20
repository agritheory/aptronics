frappe.ui.form.on("Purchase Invoice", {
	refresh: (frm) => {
		//
	},
	is_return: (frm) => {
		toggleNamingSeries(frm);
	}
});

function toggleNamingSeries(frm){
	if(frm.doc.is_return == 1){
		frm.doc.naming_series = 'PCR.#######';
	} else {
		frm.doc.naming_series = 'PIH.#######';
	}
	frm.refresh_field('naming_series');
}