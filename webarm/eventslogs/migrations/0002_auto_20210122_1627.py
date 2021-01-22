# Generated by Django 3.1.1 on 2021-01-22 14:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('eventslogs', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='record',
            name='date',
            field=models.DateTimeField(auto_now_add=True, verbose_name='Время и дата записи'),
        ),
        migrations.AlterField(
            model_name='record',
            name='message',
            field=models.TextField(default='', verbose_name='Сообщение'),
        ),
    ]
