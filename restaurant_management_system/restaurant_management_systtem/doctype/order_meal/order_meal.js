// // Copyright (c) 2025, Asha Rawat and contributors
// // For license information, please see license.txt

// // frappe.ui.form.on("Order Meal", {
// // 	refresh(frm) {

// // 	},
// frappe.ui.form.on("Table Data", {
//     table_type: function(frm, cdt, cdn) {
//         // let row = locals[cdt][cdn];

//         // // Mapping of table type to capacity
//         // let capacity_map = {
//         //     "Solo Table": 1,
//         //     "Couple Table": 2,
//         //     "Booth Table": 6,
//         //     "High-Top Table": 4,
//         //     "Low Table": 4,
//         //     "Round Table": 10,
//         //     "Rectangular Table": 12,
//         //     "Square Table": 6,
//         //     "Chef’s Table": 6,
//         //     "Communal Table": 10,
//         //     "Picnic Table": 8,
//         //     "Outdoor Patio Table": 6,
//         //     "Booth with Table": 4,
//         //     "Bar Counter Table": 4,
//         //     "Banquet Table": 20,
//         //     "Tasting Menu Table": 6,
//         //     "VIP Table": 10,
//         //     "Barrel Table": 4,
//         //     "Sushi Bar Table": 4,
//         //     "Rotating Table": 12
//         // };

//         // // Mapping of table type to price
//         // let price_map = {
//         //     "Solo Table": 100,
//         //     "Couple Table": 200,
//         //     "Booth Table": 400,
//         //     "High-Top Table": 350,
//         //     "Low Table": 300,
//         //     "Round Table": 600,
//         //     "Rectangular Table": 700,
//         //     "Square Table": 500,
//         //     "Chef’s Table": 800,
//         //     "Communal Table": 900,
//         //     "Picnic Table": 450,
//         //     "Outdoor Patio Table": 550,
//         //     "Booth with Table": 500,
//         //     "Bar Counter Table": 250,
//         //     "Banquet Table": 1500,
//         //     "Tasting Menu Table": 1000,
//         //     "VIP Table": 2000,
//         //     "Barrel Table": 300,
//         //     "Sushi Bar Table": 600,
//         //     "Rotating Table": 1200
//         // };

//         // // Fetch mapped values
//         // let capacity = capacity_map[row.table_type] || 0;
//         // let price = price_map[row.table_type] || 0;

//         // // Set values in the child table row
//         // frappe.model.set_value(cdt, cdn, 'seating_capacity', capacity);
//         // frappe.model.set_value(cdt, cdn, 'table_price', price);

//         // // ✅ If you want to set values in parent Doctype too, make sure these fields exist there!
//         // // frm.set_value('seating_capacity', capacity); // only if field exists
//         // // frm.set_value('price', price); // only if field exists
//     }
// });

// frappe.ui.form.on('Table Booking', {
//     table_name: function(frm, cdt, cdn) {
//         let row = locals[cdt][cdn];
//         if (row.restaurant_master && row.table_name) {
//             frappe.call({
//                 method: 'frappe.client.get',
//                 args: {
//                     doctype: 'Restaurant Master',
//                     name: row.restaurant_master
//                 },
//                 callback: function(r) {
//                     if (r.message && r.message.table_data) {
//                         let table_row = r.message.table_data.find(d => d.table_name === row.table_name);
//                         if (table_row) {
//                             frappe.model.set_value(cdt, cdn, 'table_price', table_row.table_price);
//                             frappe.model.set_value(cdt, cdn, 'total_amount', table_row.table_price * (row.quantity || 1));
//                         }
//                     }
//                 }
//             });
//         }
//     },

//     quantity: function(frm, cdt, cdn) {
//         let row = locals[cdt][cdn];
//         if (row.table_price && row.quantity) {
//             frappe.model.set_value(cdt, cdn, 'total_amount', row.table_price * row.quantity);
//         }
//     }
// });

frappe.ui.form.on('Order Meal', {
    restaurant_name(frm) {
        frm.set_query('table_name', () => {
            return {
                filters: {
                    restaurant_name: frm.doc.restaurant_name  // Change 'restaurant' to 'restaurant_name'
                }
            };
        });
    }
});
