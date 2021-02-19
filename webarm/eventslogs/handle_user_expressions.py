from devices.models import Tag

import re


# expression example: 
# {{tag1}} > 10 or ( {{tag2}} < 5 and {{tag3}} = 2 )



def parse_used_tags(expression):
    # parse the expression for find used tags
    tag_codes = re.findall(r'\{\{(\w+)\}\}', expression)
    return tag_codes



def eval_expression(expression):
    # execute the expression and return result
    eval_expression = str(expression)
    tag_codes = parse_used_tags(expression)
    for tc in tag_codes:
        tag_value = Tag.objects.get(code=tc).value
        eval_expression = eval_expression.replace(r'{{' + tc + r'}}', str(tag_value))
    return eval(eval_expression) 



# check expration for being safe
def is_expression_safe(expression):
    result = expression
    # remove tag codes
    result = re.sub(r'\{\{\w*\}\}', '', result)
    # remove digits
    result = re.sub(r'[\d.]+', '', result)
    # remove allowed simbols
    result = re.sub(r'[-/%><=!&~\^\|\(\)\+\*]+', '', result)
    # remove allowed words
    exclusions = '|'.join([r'\bor\b', r'\band\b', r'\bnot\b'])
    result = re.sub(exclusions, '', result)
    # remove spaces
    result = re.sub(r'\s+', '', result)

    # if the result is not empty, then the expression contains forbidden characters
    safe = (result == '')
    return safe