
from __future__ import absolute_import, unicode_literals
from celery import shared_task
from celery.utils.log import get_task_logger

from .con_mqtt import PullHandler, MqttClient


logger = get_task_logger(__name__)
handler = None
counter = 0


@shared_task(name="connectors.handle_connectors")
def handl_connectors():
    global counter, handler
    if handler is None:
        mqtt = MqttClient()
        handler = PullHandler(mqtt, autorequest=True)
        handler.subscribe('ci-cloud/#')
        
    handler.make_requests()

    counter += 1
    logger.info(f'Connectors task was called [{counter}]')

