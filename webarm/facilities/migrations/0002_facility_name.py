# Generated by Django 3.1.1 on 2020-11-23 13:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('facilities', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='facility',
            name='name',
            field=models.CharField(default='name', max_length=200, verbose_name='Наименование'),
            preserve_default=False,
        ),
    ]
