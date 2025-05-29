import frappe
from frappe import _

def get_context(context):
    # Fetching reservation data from the Reservation doctype
    context.reservations = frappe.get_all(
        'Reservation',
        fields=['name as id', 'customer', 'no_of_guests as guests', 'reservation_date as date', 'reservation_start_time as start_time', 'reservation_end_time as end_time', 'restaurant_name as restaurant'],
    )

    # Fetching table details dynamically from the 'Restaurant Table Master' doctype
    context.tables = frappe.get_all(
        'Restaurant Table Master',
        fields=['name as id', 'table_name', 'seating_capacity', 'table_location', 'table_shape', 'restaurant_name as restro'],
    )
    
    return context

