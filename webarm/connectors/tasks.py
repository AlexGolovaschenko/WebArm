
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
    if not handler:
        mqtt = MqttClient()
        handler = PullHandler(mqtt)
        handler.subscribe('ci-cloud/#')

    while rq_list := handler.get_requests_list():
        for rq in rq_list:
            async_request(rq)

    counter += 1
    logger.info(f'Connectors task was called [{counter}]')


@shared_task(name="connectors.async_request")
def async_request(rq):
    global handler
    handler._pull_connector(*rq)


