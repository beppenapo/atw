BEGIN;
update us set tipo = 2 where (us = 9
or us = 13
or us = 16
or us = 17
or us = 19
or us = 22
or us = 27
or us = 33
or us = 35
or us = 38
or us = 42
or us = 43
or us = 44
or us = 58
or us = 60
or us = 63
or us = 75
or us = 77
or us = 78
or us = 79
or us = 80
or us = 81
or us = 82
or us = 85
or us = 89
or us = 92
or us = 101) and scavo = 43;
COMMIT;
