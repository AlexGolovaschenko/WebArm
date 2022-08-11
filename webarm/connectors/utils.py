from devices.serializers import get_current_tag_value_serializer


def update_tag_value(tag_obj, tag_value, tag_quality):
    ''' write tag value depending on tag data type '''    
    data = {'tag': tag_obj.id, 'value':tag_value, 'quality':tag_quality}
    serializer = get_current_tag_value_serializer(tag_obj)
    try:
        # update
        obj = tag_obj.CurrentValueModel.objects.get(tag=tag_obj)
        v_serializer = serializer(obj, data=data) 
    except:
        # create new
        v_serializer = serializer(data=data) 

    if v_serializer.is_valid():
        v_serializer.save()
        return v_serializer.data
    else:
        return v_serializer.errors
