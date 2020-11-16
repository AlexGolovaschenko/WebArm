from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from django.utils.crypto import get_random_string

from .models import Connector

@receiver(pre_save, sender=Connector)
def get_new_token(sender, instance, **kwargs):
    if not instance.token:
        instance.token = get_unique_token()

    if not instance.registration_code:
        instance.registration_code = get_unique_registration_code()


def get_unique_token(attempt=1):
    token = get_random_string(length=40)
    if Connector.objects.filter(token=token).exists():
        attempt = attempt + 1
        if attempt >= 900:
            raise Exception("Can't get a unique token. Is to many Recursion here (%s attempts)" %(attempt))
        else:
            token = get_unique_token(attempt) # recursion
    return token


def get_unique_registration_code(attempt=1):
    code = get_random_string(length=8, allowed_chars='0123456789ABCDEF')
    if Connector.objects.filter(registration_code=code).exists():
        attempt = attempt + 1
        if attempt >= 900:
            raise Exception("Can't get a unique token. Is to many Recursion here (%s attempts)" %(attempt))
        else:
            code = get_unique_registration_code(attempt) # recursion
    return code