from __future__ import unicode_literals

import sys

import frappe

@frappe.whitelist()
def check_email_address(doc, method):
    data = str(doc.as_dict())
    frappe.logger().info(doc.recipients)
    for i in doc.recipients:
        frappe.logger().info(i.as_dict())