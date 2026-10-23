# Refund slice

REF-01: Refund is the smaller of paid and requested, for nonnegative integer amounts. At exact equality, the paid amount is returned.
REF-02: Negative or fractional input is rejected.

Required checks: lower request, capped higher request, exact equality, invalid inputs. Target: local synthetic only. Candidate revision label: fixture-c06. No network or external effects are allowed. This slice excludes service authorization and real payment integrations.
