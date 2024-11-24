import pyarrow as pa
import pyarrow.compute as pc


class FiltersModel:
    @classmethod
    def equal(cls, a, b):
        return pc.equal(a, b)

    @classmethod
    def not_equal(cls, a, b):
        return pc.not_equal(a, b)

    @classmethod
    def starts_with(cls, a, b):
        return pc.starts_with(a, b)

    @classmethod
    def ends_with(cls, a, b):
        return pc.ends_with(a, b)

    @classmethod
    def is_empty(cls, a, b):
        return pc.is_null(a)

    @classmethod
    def not_empty(cls, a, b):
        return pc.is_valid(a)

    @classmethod
    def contains(cls, a, b):
        return pc.match_substring(a, b)

    @classmethod
    def does_not_contain(cls, a, b):
        return ~(pc.match_substring(a, b))

    @classmethod
    def is_any_of(cls, a, b):
        return pc.is_in(a, value_set=pa.array(b))

    @classmethod
    def greater_than(cls, a, b):
        return pc.greater(a, b)

    @classmethod
    def less_than(cls, a, b):
        return pc.less(a, b)

    @classmethod
    def greater_or_equal(cls, a, b):
        return pc.greater_equal(a, b)

    @classmethod
    def less_or_equal(cls, a, b):
        return pc.less_equal(a, b)

    @classmethod
    def operator(cls, operator_readable: str):
        if operator_readable == "is" or operator_readable == "=":
            return cls.equal
        if operator_readable == "equals":
            return cls.equal
        if (
            operator_readable == "doesNotEqual"
            or operator_readable == "not"
            or operator_readable == "!="
        ):
            return cls.not_equal
        if operator_readable == "startsWith":
            return cls.starts_with
        if operator_readable == "endsWith":
            return cls.ends_with
        if operator_readable == "isEmpty":
            return cls.is_empty
        if operator_readable == "isNotEmpty":
            return cls.not_empty
        if operator_readable == "contains":
            return cls.contains
        if operator_readable == "doesNotContain":
            return cls.does_not_contain
        if operator_readable == "isAnyOf":
            return cls.is_any_of
        if operator_readable == ">" or operator_readable == "after":
            return cls.greater_than
        if operator_readable == "<" or operator_readable == "before":
            return cls.less_than
        if operator_readable == ">=" or operator_readable == "onOrAfter":
            return cls.greater_or_equal
        if operator_readable == "<=" or operator_readable == "onOrBefore":
            return cls.less_or_equal
