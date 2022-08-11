from django.utils import timezone


def verbose_update_timestamp(update_timestamp):
    ''' возвращает время посленего обновления данных устройства в более удобном для чтения виде
        например: "только что", "3 минтуы назад", "вчера" ...
    '''
    if not update_timestamp:
        return 'никогда'
    if update_timestamp > (timezone.now()-timezone.timedelta(minutes=1)):
        return 'только что'
    elif update_timestamp > (timezone.now()-timezone.timedelta(minutes=2)):
        return '1 минуту назад'    
    elif update_timestamp > (timezone.now()-timezone.timedelta(minutes=4)):
        td = timezone.now() - update_timestamp
        return '%s минуты назад' %( (td.seconds//60)%60 )
    elif update_timestamp > (timezone.now()-timezone.timedelta(minutes=59)):
        td = timezone.now() - update_timestamp
        return '%s минут назад' %( (td.seconds//60)%60 )
    elif update_timestamp > (timezone.now()-timezone.timedelta(hours=2)):
        return 'больше часа назад' 
    elif update_timestamp > (timezone.now()-timezone.timedelta(hours=24)):
        td = timezone.now() - update_timestamp
        return 'больше %s часов назад' %( td.seconds//3600 ) 
    elif update_timestamp > (timezone.now()-timezone.timedelta(days=1, hours=24)):
        return 'вчера, в %s' %( update_timestamp.strftime("%H:%M") )                                   
    else:
        return update_timestamp.strftime("%d %b %H:%M")
