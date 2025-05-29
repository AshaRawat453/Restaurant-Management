# Copyright (c) 2025, Asha Rawat and contributors
# For license information, please see license.txt

# import frappe
# from frappe.model.document import Document


# @frappe.whitelist()
# def get_table_rate(restaurant_master, table_name):
#     doc = frappe.get_doc("Restaurant Master", restaurant_master)
#     for row in doc.table_data:
#         if row.table_name == table_name:
#             return {
#                 "table_price": row.table_price
#             }
#     return {}
    # def after_insert(self):
    #     self.create_user_from_email()
   
    # def create_user_from_email(self):
    #     email = self.customer_email  # Your actual field name

    #     if email and not frappe.db.exists("User", email):
    #         user = frappe.new_doc("User")
    #         user.email = email
    #         user.first_name = email.split("@")[0]

    #         user.append("roles", {"role": "Customer"})

    #         user.save()
    #         frappe.msgprint(f"🎉 User created and assigned 'Customer' role for {email}")
    #     else:
    #         user.append("roles", {"role": "Customer"})
    #         frappe.msgprint("⚠️ Email is missing or user already exists")
import frappe
from frappe.model.document import Document

class OrderMeal(Document):
    def validate(self):
        for item in self.order_meal_list:
            if item.quantity <= 0:
                frappe.throw(f"Quantity for {item.food_item} must be greater than 0.")
            if item.rate <= 0:
                frappe.throw(f"Rate for {item.food_item} must be greater than 0.")
            # if item.total_amount <= 0:
            #     frappe.throw(f"Amount for {item.food_item} must be greater than 0.")

            item.total_amount = item.quantity * item.rate
