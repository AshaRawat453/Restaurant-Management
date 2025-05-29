# Copyright (c) 2025, Asha Rawat and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class RestaurantTableMaster(Document):
    def before_insert(self):
        # Make a short code from restaurant name (e.g., "Dominos" -> "DOM")
        restaurant_code = ''.join(word[0] for word in self.restaurant_name.upper().split())[:3]
        restaurant_code = restaurant_code if restaurant_code else "RST"

        # Filter tables for this specific restaurant
        last_table = frappe.get_all("Restaurant Table Master",
                                    filters={"restaurant_name": self.restaurant_name},
                                    fields=["table_name"],
                                    order_by="creation desc",
                                    limit=1)

        if last_table:
            # Extract last table number from naming like "T-DOM-02"
            last_table_name = last_table[0].get("table_name")
            try:
                last_number = int(last_table_name.split("-")[-1])
                next_number = last_number + 1
            except (IndexError, ValueError):
                next_number = 1
        else:
            next_number = 1

        # Set new table name
        self.table_name = f"T-{restaurant_code}-{next_number:02d}"
