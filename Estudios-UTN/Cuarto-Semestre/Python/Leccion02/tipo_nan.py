import math
from decimal import Decimal

# NaN (Not a Number)
a = float('nan')
print(f'a: {a}')

# Modulo math
a: float = float('nan')
print(f'Es de tipo NaN(Not a Number)?: {math.isnan(a)}')

# Módulo decimal
a = Decimal('nan')
print(f'Es de tipo NaN(Not a Number)?: {math.isnan(a)}')